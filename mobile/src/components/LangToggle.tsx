import { Pressable, StyleSheet, Text, View } from 'react-native'
import { colors, radius } from '../theme/theme'
import { useI18n } from '../i18n/I18nContext'

export default function LangToggle() {
  const { lang, setLang, langs } = useI18n()
  return (
    <View style={styles.wrap}>
      {langs.map((l) => {
        const active = lang === l.code
        return (
          <Pressable key={l.code} onPress={() => setLang(l.code)} style={[styles.item, active && styles.itemActive]}>
            <Text style={[styles.text, active && styles.textActive]}>{l.label}</Text>
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', backgroundColor: colors.slate100, borderRadius: radius.md, padding: 3 },
  item: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.sm },
  itemActive: { backgroundColor: '#fff' },
  text: { fontSize: 12, fontWeight: '700', color: colors.slate500 },
  textActive: { color: colors.brand700 },
})
