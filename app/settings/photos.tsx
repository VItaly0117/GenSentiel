import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, SafeAreaView, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { File, Directory, Paths } from 'expo-file-system';
import { Camera, ChevronLeft, Trash2 } from 'lucide-react-native';
import { useTranslation } from '../../src/i18n/useTranslation';

const Colors = {
  black: '#000000',
  primaryContainer: '#c3f400',
  surfaceVariant: '#333535',
  onSurface: '#e2e2e2',
  onSurfaceVariant: '#c4c9ac',
  cardBg: '#111111',
  cardBorder: '#2A2A2A',
  error: '#ffb4ab',
};

interface ProgressPhoto {
  id: string;
  uri: string;
  date: string;
}

export default function ProgressPhotosScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);

  const getPhotosDir = () => new Directory(Paths.document, 'progress_photos');

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = () => {
    try {
      const dir = getPhotosDir();
      if (!dir.exists) {
        dir.create({ intermediates: true, idempotent: true });
        return;
      }

      const items = dir.list();
      const loaded = items
        .filter((item): item is File => item instanceof File)
        .flatMap(file => {
          const timestamp = parseInt(file.name.split('.')[0]);
          if (isNaN(timestamp)) return [];
          return [{ id: file.name, uri: file.uri, date: new Date(timestamp).toISOString() }];
        });

      loaded.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setPhotos(loaded);
    } catch (e) {
      console.log('Failed to load photos', e);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(t('photos.permissionTitle'), t('photos.permissionBody'));
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      try {
        const sourceUri = result.assets[0].uri;
        const fileName = `${Date.now()}.jpg`;
        const dir = getPhotosDir();
        if (!dir.exists) dir.create({ intermediates: true, idempotent: true });

        const sourceFile = new File(sourceUri);
        const destFile = new File(dir, fileName);
        sourceFile.copy(destFile);
        loadPhotos();
      } catch (e) {
        console.error('Failed to save photo', e);
        Alert.alert(t('photos.saveFailTitle'), t('photos.saveFailBody'));
      }
    }
  };

  const deletePhoto = (id: string, uri: string) => {
    Alert.alert(t('photos.deleteTitle'), t('photos.deleteBody'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: () => {
          try {
            const file = new File(uri);
            if (file.exists) file.delete();
            loadPhotos();
          } catch (e) {
            console.error('Failed to delete photo', e);
            Alert.alert(t('photos.saveFailTitle'), t('photos.deleteFailBody'));
          }
        },
      },
    ]);
  };

  const formatDate = (isoStr: string) => {
    const d = new Date(isoStr);
    const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={Colors.onSurface} />
        </Pressable>
        <Text style={styles.topTitle}>{t('photos.title')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        
        {photos.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconBox}>
              <Camera size={32} color={Colors.primaryContainer} />
            </View>
            <Text style={styles.emptyTitle}>{t('photos.emptyTitle')}</Text>
            <Text style={styles.emptyDesc}>
              {t('photos.emptyDesc')}
            </Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {photos.map(photo => (
              <View key={photo.id} style={styles.photoCard}>
                <Image source={{ uri: photo.uri }} style={styles.image} />
                <View style={styles.photoFooter}>
                  <Text style={styles.photoDate}>{formatDate(photo.date)}</Text>
                  <Pressable onPress={() => deletePhoto(photo.id, photo.uri)} style={styles.delBtn}>
                    <Trash2 size={16} color={Colors.error} />
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}

      </ScrollView>

      {/* FAB */}
      <Pressable style={styles.fab} onPress={takePhoto}>
        <Camera size={24} color={Colors.black} />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceVariant,
  },
  backBtn: {
    padding: 4,
  },
  topTitle: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 18,
    color: '#ffffff',
    letterSpacing: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    backgroundColor: Colors.cardBg,
    padding: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  emptyIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(195, 244, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(195, 244, 0, 0.3)',
  },
  emptyTitle: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 20,
    color: '#ffffff',
    marginBottom: 8,
  },
  emptyDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  photoCard: {
    width: '48%',
    backgroundColor: Colors.cardBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: 'hidden',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    aspectRatio: 3/4,
    backgroundColor: Colors.surfaceVariant,
  },
  photoFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  photoDate: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    textTransform: 'uppercase',
  },
  delBtn: {
    padding: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primaryContainer,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
});
