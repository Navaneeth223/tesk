import { SafeAreaView, StyleSheet, View } from 'react-native';

export function LoadingScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <View style={[styles.block, styles.hero]} />
        <View style={[styles.block, styles.row]} />
        <View style={[styles.block, styles.row]} />
        <View style={[styles.block, styles.card]} />
        <View style={[styles.block, styles.card]} />
        <View style={[styles.block, styles.card]} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#09111F',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 16,
  },
  block: {
    backgroundColor: '#18233A',
    borderRadius: 22,
  },
  hero: {
    height: 170,
  },
  row: {
    height: 54,
  },
  card: {
    height: 120,
  },
});
