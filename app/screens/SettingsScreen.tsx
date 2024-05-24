import { Header, Text } from "app/components"
import { AppStackScreenProps } from "app/navigators"
import { colors, spacing } from "app/theme"
import { constants } from "app/utils/constanst"
import svgs from "assets/svgs"
import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { StyleSheet, View } from "react-native"

interface SettingsScreenProps extends AppStackScreenProps<"Settings"> {}

const { share: ShareSvg, rate: RateSvg, privacy: PrivacySvg, bg: QrSvg } = svgs

export const SettingsScreen: FC<SettingsScreenProps> = observer(function SettingsScreen({
  navigation,
}) {
  return (
    <View style={styles.container}>
      <Header
        backgroundColor="transparent"
        onLeftPress={() => navigation.goBack()}
        title="Settings"
        titleStyle={styles.textPrimary}
        leftIconColor={colors.palette.neutral100}
        leftIcon="caretLeft"
      />
      <View style={styles.bg}>
        <QrSvg width={constants.width} height={constants.height} />
      </View>

      <View style={styles.paddingLg}>
        {renderSettingsOption(RateSvg, "Rate Us", "Your best reward to us.")}
        <View style={styles.spacingLg} />
        {renderSettingsOption(ShareSvg, "Share", "Share app with others.")}
        <View style={styles.spacingLg} />
        {renderSettingsOption(
          PrivacySvg,
          "Privacy Policy",
          "Follow our policies that benefits you.",
        )}
      </View>
    </View>
  )
})

function renderSettingsOption(IconComponent: any, title: string, subtitle: string) {
  return (
    <View style={styles.data}>
      <IconComponent width={spacing.lg} height={spacing.lg} />
      <View style={styles.spacingSm} />
      <View>
        <Text style={styles.text} weight="semiBold">
          {title}
        </Text>
        <Text style={styles.textSub} size="xs">
          {subtitle}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  bg: {
    backgroundColor: colors.palette.neutral800,
    position: "absolute",
    zIndex: -1,
  },
  container: {
    flex: 1,
  },
  data: {
    alignItems: "center",
    backgroundColor: colors.palette.neutral700,
    borderRadius: 8,
    flexDirection: "row",
    padding: spacing.sm,
  },
  paddingLg: {
    padding: spacing.lg,
  },
  spacingLg: {
    height: spacing.lg,
  },
  spacingSm: {
    width: spacing.sm,
  },
  text: {
    color: colors.palette.accent100,
  },
  textPrimary: {
    color: colors.palette.accent500,
  },
  textSub: {
    color: colors.palette.secondary100,
  },
})
