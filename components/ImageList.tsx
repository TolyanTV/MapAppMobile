import { ImageListProps } from "@/types";
import { Button, FlatList, Image, StyleSheet, Text, View } from 'react-native';

export default function ImageList({images, deleteImage}: ImageListProps){
    if (images.length === 0){
        return <Text style={styles.emptyMessage}>Нет изображения</Text>;
    }
    return (
        <FlatList
            data={images}
            keyExtractor={item => item.id}
            horizontal={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 100}}
            renderItem={({item}) => (
                <View style={styles.itemContainer}>
                    <Image 
                    style={styles.image}
                    source={{ uri: item.uri }}
                    />
                    <Button 
                    title="Удалить изображение" 
                    onPress={() => deleteImage(item.id)}
                    color="red"
                    />
                </View>
            )}
        />
    )
}

const styles = StyleSheet.create({
  emptyMessage: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'black',
  },
  itemContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  image: {
    width: 185,
    height: 100,
    resizeMode: 'cover',
    marginBottom: 10,
  },
});