/* eslint-disable react-native/no-color-literals */
import Slider from "@react-native-community/slider"
import { constants } from "app/utils/constanst"
import images from "assets/images"
import * as ImagePicker from "expo-image-picker"
import { observer } from "mobx-react-lite"
import React, { FC, useCallback, useEffect, useRef, useState } from "react"
import { Image, Pressable, StyleSheet, Text, View, ViewStyle } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Reanimated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useSharedValue,
} from "react-native-reanimated"
import {
  Camera,
  Point,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from "react-native-vision-camera"
import Svgs from "../../assets/svgs"
import { AppStackScreenProps } from "../navigators"
import { colors } from "../theme"

const ICONS = [
  { Svg: Svgs.gallery, label: "Gallery" },
  { Svg: Svgs.lighting, label: "Lighting" },
  { Svg: Svgs.camera, label: "Camera" },
  { Svg: Svgs.roundQr, label: "Settings" },
  { Svg: Svgs.history, label: "History" },
]

Reanimated.addWhitelistedNativeProps({
  zoom: true,
})

const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera)

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}

export const WelcomeScreen: FC<WelcomeScreenProps> = observer(function WelcomeScreen({
  navigation,
}) {
  const { hasPermission, requestPermission } = useCameraPermission()
  const [cameraPosition, setCameraPosition] = useState<"front" | "back">("back")
  const device = useCameraDevice(cameraPosition)
  const camera = useRef<Camera>(null)
  const [flash, setFlash] = useState<"off" | "on">("off")

  const supportsFlash = device?.hasFlash ?? false
  const onFlashPressed = useCallback(() => {
    setFlash((f) => (f === "off" ? "on" : "off"))
  }, [])

  const zoom = useSharedValue(device?.neutralZoom)
  const focus = useCallback((point: Point) => {
    const c = camera.current
    if (c == null) return
    c.focus(point)
  }, [])

  const gesture = Gesture.Tap().onEnd(({ x, y }) => {
    runOnJS(focus)({ x, y })
  })

  const codeScanner = useCodeScanner({
    codeTypes: ["qr", "ean-13"],
    onCodeScanned: (codes) => {
      navigation.navigate("Result", { qr: codes[0]?.value || "" })
    },
  })

  const onPressAction = (index: number) => {
    switch (index) {
      case 0:
        pickImage()
        break
      case 1:
        if (index === 1 && supportsFlash) {
          onFlashPressed()
        }
        break
      case 2:
        setCameraPosition((position) => (position === "back" ? "front" : "back"))
        break
      default:
        break
    }
  }

  const onPressActionBottom = (index: number) => {
    switch (index) {
      case 0:
        navigation.navigate("Settings")
        break
      case 1:
        navigation.navigate("History")
        break
      case 2:
      default:
        break
    }
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    console.log(result)
  }

  useEffect(() => {
    if (!hasPermission) {
      requestPermission()
    }
  }, [])

  if (!hasPermission || device == null) return null

  return (
    <View style={$container}>
      <GestureDetector gesture={gesture}>
        <View style={styles.container}>
          <View style={styles.topBar}>
            <View style={styles.iconContainer}>
              {ICONS.slice(0, 3).map(({ Svg }, index) => (
                <Pressable
                  key={index}
                  onPress={() => {
                    onPressAction(index)
                  }}
                >
                  <Svg key={index} width={25} height={25} />
                </Pressable>
              ))}
            </View>
          </View>
          <ReanimatedCamera
            ref={camera}
            style={styles.camera}
            device={device}
            isActive={true}
            codeScanner={codeScanner}
            torch={flash}
            zoom={zoom}
          />
          <View style={styles.bottomBar}>
            <View style={styles.slider}>
              <Slider
                style={styles.sliderItem}
                minimumValue={0}
                maximumValue={1}
                onValueChange={(value) => {
                  zoom.value = interpolate(
                    value,
                    [0, 1],
                    [device.minZoom, device.maxZoom],
                    Extrapolation.CLAMP,
                  )
                }}
                minimumTrackTintColor={colors.palette.accent500}
                maximumTrackTintColor={colors.palette.neutral100}
              />
            </View>
            <View style={styles.iconContainer}>
              <View style={styles.qrSvg}>
                <Image style={styles.qrIcon} source={images.qr}></Image>
              </View>
              {ICONS.slice(3).map(({ Svg, label }, index) => (
                <Pressable
                  key={index}
                  onPress={() => {
                    onPressActionBottom(index)
                  }}
                >
                  <View key={index} style={styles.iconLabel}>
                    <Svg width={25} height={25} />
                    <View style={styles.separator} />
                    <Text style={styles.text}>{label}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </GestureDetector>
    </View>
  )
})

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
}

const styles = StyleSheet.create({
  bottomBar: {
    alignItems: "center",
    bottom: 50,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    zIndex: 10,
  },
  camera: { flex: 1 },
  container: { flex: 1 },
  iconContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    paddingVertical: 10,
    width: "70%",
  },
  iconLabel: { alignItems: "center" },
  qrIcon: {
    height: 100,
    width: 100,
  },
  qrSvg: {
    alignItems: "center",
    backgroundColor: "transparent",
    left: 0,
    position: "absolute",
    right: 0,
    top: -50,
    zIndex: -1,
  },
  separator: { height: 2 },
  slider: {
    position: "absolute",
    top: -100,
  },
  sliderItem: {
    height: 20,
    width: constants.width * 0.7,
  },
  text: {
    color: "#D9D9D9",
    fontSize: 12,
  },
  topBar: {
    alignItems: "center",
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 50,
    zIndex: 1,
  },
})
