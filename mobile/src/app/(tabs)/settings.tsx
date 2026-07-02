import { useEffect, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getKeys, saveKeys, clearKeys, type Provider } from '@/services/keystore'
import { useI18n } from '@/i18n/I18nContext'
import LangToggle from '@/components/LangToggle'
import { Button } from '@/components/ui'
import { colors, radius, spacing } from '@/theme/theme'

export default function SettingsScreen() {
  const { t } = useI18n()
  const [provider, setProvider] = useState<Provider>('auto')
  const [anthropic, setAnthropic] = useState('')
  const [openai, setOpenai] = useState('')
  const [unsplash, setUnsplash] = useState('')
  const [savedMsg, setSavedMsg] = useState(false)

  useEffect(() => {
    const k = getKeys()
    setProvider(k.provider)
    setAnthropic(k.anthropic)
    setOpenai(k.openai)
    setUnsplash(k.unsplash)
  }, [])

  const save = async () => {
    await saveKeys({ provider, anthropic, openai, unsplash })
    setSavedMsg(true)
    setTimeout(() => setSavedMsg(false), 1500)
  }

  const reset = async () => {
    await clearKeys()
    const k = getKeys()
    setProvider(k.provider)
    setAnthropic(k.anthropic)
    setOpenai(k.openai)
    setUnsplash(k.unsplash)
  }

  const engines: { val: Provider; label: string }[] = [
    { val: 'auto', label: t('settings.auto') },
    { val: 'anthropic', label: 'Claude' },
    { val: 'openai', label: 'GPT' },
  ]

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{t('settings.title')}</Text>
        <Text style={styles.sub}>{t('settings.subtitle')}</Text>

        <Text style={styles.sectionLabel}>{t('settings.language')}</Text>
        <LangToggle />

        <Text style={styles.sectionLabel}>{t('settings.engine')}</Text>
        <View style={styles.segment}>
          {engines.map((e) => (
            <Pressable
              key={e.val}
              onPress={() => setProvider(e.val)}
              style={[styles.segItem, provider === e.val && styles.segItemActive]}
            >
              <Text style={[styles.segText, provider === e.val && styles.segTextActive]}>{e.label}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.hint}>{t('settings.engineHint')}</Text>

        <Field label={t('settings.anthropic')} value={anthropic} onChange={setAnthropic} placeholder="sk-ant-..." />
        <Field label={t('settings.openai')} value={openai} onChange={setOpenai} placeholder="sk-..." />
        <Field label={t('settings.unsplash')} value={unsplash} onChange={setUnsplash} placeholder="Client-ID" />

        <Button
          title={savedMsg ? t('settings.saved') + ' ✓' : t('settings.save')}
          onPress={save}
          size="lg"
          style={{ marginTop: spacing.lg }}
        />
        <Text style={styles.resetBtn} onPress={reset}>
          {t('settings.reset')}
        </Text>
      </ScrollView>
    </SafeAreaView>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  return (
    <View style={{ marginTop: spacing.lg }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.slate400}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl * 2 },
  title: { fontSize: 21, fontWeight: '800', color: colors.ink },
  sub: { marginTop: 4, fontSize: 13, color: colors.slate500 },
  sectionLabel: { marginTop: spacing.xl, marginBottom: spacing.sm, fontSize: 14, fontWeight: '700', color: colors.slate600 },
  segment: { flexDirection: 'row', backgroundColor: colors.slate100, borderRadius: radius.md, padding: 4, gap: 4 },
  segItem: { flex: 1, paddingVertical: 8, borderRadius: radius.sm, alignItems: 'center' },
  segItemActive: { backgroundColor: '#fff' },
  segText: { fontSize: 14, fontWeight: '700', color: colors.slate500 },
  segTextActive: { color: colors.brand700 },
  hint: { marginTop: 6, fontSize: 12, color: colors.slate400 },
  fieldLabel: { fontSize: 14, fontWeight: '700', color: colors.slate600, marginBottom: 6 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.ink,
  },
  resetBtn: { marginTop: spacing.lg, textAlign: 'center', fontSize: 13, fontWeight: '600', color: colors.slate400 },
})
