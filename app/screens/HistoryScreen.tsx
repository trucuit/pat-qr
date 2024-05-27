import { Header, Text } from "app/components"
import { HistoryItem, useStores } from "app/models"
import { AppStackScreenProps } from "app/navigators"
import { colors, spacing } from "app/theme"
import { constants } from "app/utils/constanst"
import svgs from "assets/svgs"
import dayjs from "dayjs"
import { toJS } from "mobx"
import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native"

interface HistoryScreenProps extends AppStackScreenProps<"History"> {}

const { trash: TrashSvg, bg: QrSvg, qr1: QrSvgIcon } = svgs

export const HistoryScreen: FC<HistoryScreenProps> = observer(function HistoryScreen({
  navigation,
}) {
  const { historyStore } = useStores()

  const removeHistory = (id: string) => {
    historyStore.removeHistory(id)
  }

  return (
    <View style={styles.container}>
      <Header
        backgroundColor="transparent"
        onLeftPress={() => navigation.goBack()}
        title="History"
        titleStyle={styles.textPrimary}
        leftIconColor={colors.palette.neutral100}
        leftIcon="caretLeft"
      />
      <View style={styles.bg}>
        <QrSvg width={constants.width} height={constants.height} />
      </View>

      <View style={styles.paddingLg}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={toJS(historyStore.data)}
          keyExtractor={(item) => item.timestamp.toString()}
          renderItem={({ item }) => renderSettingsOption(item, removeHistory)}
          ItemSeparatorComponent={() => <View style={styles.spacingLg} />}
        ></FlatList>
      </View>
    </View>
  )
})

function renderSettingsOption(item: HistoryItem, removeHistory: (id: string) => void) {
  return (
    <View style={styles.data}>
      <View style={styles.dataHistory}>
        <View>
          <QrSvgIcon width={spacing.lg} height={spacing.lg} />
        </View>
        <View style={styles.spacingSm}>
          <Text style={styles.text} weight="semiBold">
            {item?.data}
          </Text>
          <Text style={styles.textSub} size="xs">
            {dayjs(item?.timestamp).format("HH:mm:ss DD/MM/YYYY")}
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => removeHistory(item.id)}>
        <TrashSvg width={spacing.lg} height={spacing.lg} />
      </TouchableOpacity>
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
    justifyContent: "space-between",
    padding: spacing.sm,
  },
  dataHistory: {
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
  },
  paddingLg: {
    flex: 1,
    padding: spacing.lg,
  },
  spacingLg: {
    height: spacing.md,
  },
  spacingSm: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  text: {
    color: colors.palette.accent100,
  },
  textPrimary: {
    color: colors.palette.accent500,
  },
  textSub: {
    color: colors.palette.secondary100,
    marginTop: spacing.xxxs,
  },
})
