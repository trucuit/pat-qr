/* eslint-disable react-native/no-color-literals */
import { Header, Text } from "app/components"
import { useStores } from "app/models"
import { AppStackScreenProps } from "app/navigators"
import { colors, spacing } from "app/theme"
import { constants } from "app/utils/constanst"
import svgs from "assets/svgs"
import dayjs from "dayjs"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect } from "react"
import { StyleSheet, View } from "react-native"

interface ResultScreenProps extends AppStackScreenProps<"Result"> {}
const { bg: QrSvg, qr1: QrSvgIcon } = svgs

export const ResultScreen: FC<ResultScreenProps> = observer(function ResultScreen({
  route,
  navigation,
}) {
  const { historyStore } = useStores()

  const qr = route.params?.qr || ""

  useEffect(() => {
    if (qr) {
      historyStore.addHistory(qr)
    }
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.bg}>
        <QrSvg width={constants.width} height={constants.height} />
      </View>
      <Header
        backgroundColor="transparent"
        onLeftPress={() => navigation.goBack()}
        title="QR Code"
        titleStyle={styles.textPrimary}
        leftIconColor={colors.palette.neutral100}
        leftIcon="caretLeft"
      />
      <View
        style={{
          padding: spacing.lg,
        }}
      >
        <View style={styles.data}>
          <View style={styles.f_row}>
            <QrSvgIcon width={spacing.lg} height={spacing.lg} />
            <View style={{ width: spacing.sm }}></View>
            <View>
              <Text style={styles.text}>{dayjs().format("HH:mm:ss DD/MM/YYYY")}</Text>
              <View style={styles.gap}></View>
            </View>
          </View>
          <View style={styles.line}></View>
          <Text style={styles.text}>{qr}</Text>
        </View>
      </View>
    </View>
  )
})

const styles = StyleSheet.create({
  bg: {
    backgroundColor: "rgba(61, 61, 61, 1)",
    position: "absolute",
    zIndex: -1,
  },
  container: {
    flex: 1,
  },
  data: {
    backgroundColor: colors.palette.overlay20,
    borderRadius: 8,
    padding: 20,
  },
  f_row: {
    flexDirection: "row",
  },
  gap: {
    height: 10,
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  line: {
    backgroundColor: colors.palette.neutral500,
    height: 1,
    marginVertical: spacing.xs,
    width: "100%",
  },
  text: {
    color: colors.palette.neutral100,
  },
  textPrimary: {
    color: colors.palette.accent500,
  },
})
