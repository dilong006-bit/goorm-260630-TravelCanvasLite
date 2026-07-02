import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { colors, radius, spacing, shadow } from '../theme/theme'
import type { Story } from '../services/storage'

export default function StoryCard({ story }: { story: Story }) {
  const router = useRouter()
  const place = [story.city, story.country].filter(Boolean).join(', ')

  return (
    <Pressable
      onPress={() => router.push(`/story/${story.id}`)}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.9 }]}
    >
      <View style={styles.imageWrap}>
        {story.heroImage ? (
          <Image source={story.heroImage} style={styles.image} contentFit="cover" transition={200} />
        ) : (
          <View style={[styles.image, styles.noImage]}>
            <Text style={styles.noImageText}>No image</Text>
          </View>
        )}
        {place ? (
          <View style={styles.pin}>
            <Ionicons name="location-outline" size={12} color="#fff" />
            <Text style={styles.pinText}>{place}</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>
          {story.title}
        </Text>
        <Text style={styles.sub} numberOfLines={2}>
          {story.oneLiner || story.summary || story.content}
        </Text>
        <View style={styles.tagsRow}>
          {(story.hashtags || []).slice(0, 3).map((ttag) => (
            <View key={ttag} style={styles.tag}>
              <Text style={styles.tagText}>#{ttag}</Text>
            </View>
          ))}
          <Text style={styles.date}>{story.createdAt}</Text>
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadow.card,
  },
  imageWrap: { aspectRatio: 16 / 10, backgroundColor: colors.slate200 },
  image: { width: '100%', height: '100%' },
  noImage: { alignItems: 'center', justifyContent: 'center' },
  noImageText: { color: colors.slate400 },
  pin: {
    position: 'absolute',
    left: 10,
    top: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  pinText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  body: { padding: spacing.lg },
  title: { fontSize: 17, fontWeight: '800', color: colors.ink },
  sub: { marginTop: 4, fontSize: 13, color: colors.slate500 },
  tagsRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10, flexWrap: 'wrap' },
  tag: { backgroundColor: colors.brand50, borderRadius: radius.full, paddingHorizontal: 8, paddingVertical: 3 },
  tagText: { color: colors.brand700, fontSize: 11, fontWeight: '700' },
  date: { marginLeft: 'auto', fontSize: 11, color: colors.slate400 },
})
