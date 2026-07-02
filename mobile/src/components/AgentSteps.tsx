import { StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors, radius, spacing } from '../theme/theme'
import { useI18n } from '../i18n/I18nContext'
import { Spinner } from './ui'
import type { StepUpdate } from '../services/agent'

const ORDER = [
  { id: 'plan', key: 'agent.plan' },
  { id: 'analyze', key: 'agent.analyze' },
  { id: 'keywords', key: 'agent.keywords' },
  { id: 'search', key: 'agent.search' },
] as const

export default function AgentSteps({ steps }: { steps: Record<string, StepUpdate> }) {
  const { t } = useI18n()
  return (
    <View style={{ gap: spacing.md }}>
      {ORDER.map((s, i) => {
        const st = steps[s.id] || ({ status: 'pending' } as StepUpdate)
        const status = st.status || 'pending'
        return (
          <View key={s.id} style={styles.row}>
            <View style={styles.railCol}>
              <View style={[styles.node, nodeStyle(status)]}>
                {status === 'done' ? (
                  <Ionicons name="checkmark" size={14} color="#fff" />
                ) : status === 'running' ? (
                  <Spinner />
                ) : status === 'error' ? (
                  <Text style={styles.bang}>!</Text>
                ) : (
                  <Text style={styles.idx}>{i + 1}</Text>
                )}
              </View>
              {i < ORDER.length - 1 ? (
                <View style={[styles.line, status === 'done' && { backgroundColor: colors.brand300 }]} />
              ) : null}
            </View>
            <View style={styles.textCol}>
              <Text style={[styles.label, status === 'pending' && { color: colors.slate400 }]}>
                {st.label || t(s.key)}
              </Text>
              {st.detail ? (
                <Text style={[styles.detail, status === 'error' && { color: colors.rose600 }]}>
                  {st.detail}
                </Text>
              ) : null}
            </View>
          </View>
        )
      })}
    </View>
  )
}

function nodeStyle(status: string) {
  if (status === 'done') return { backgroundColor: colors.brand500, borderColor: colors.brand500 }
  if (status === 'running') return { backgroundColor: colors.brand50, borderColor: colors.brand400 }
  if (status === 'error') return { backgroundColor: colors.rose50, borderColor: '#fda4af' }
  return { backgroundColor: '#fff', borderColor: colors.slate200 }
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md },
  railCol: { alignItems: 'center' },
  node: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: { width: 1, flex: 1, minHeight: 18, marginVertical: 2, backgroundColor: colors.slate200 },
  idx: { fontSize: 12, fontWeight: '700', color: colors.slate400 },
  bang: { fontSize: 13, fontWeight: '800', color: colors.rose600 },
  textCol: { flex: 1, paddingTop: 3 },
  label: { fontSize: 14, fontWeight: '700', color: colors.ink },
  detail: { marginTop: 2, fontSize: 12, color: colors.slate500 },
})
