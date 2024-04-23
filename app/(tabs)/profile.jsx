import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import VideoCard from '../../components/VideoCard'
import EmptyState from '../../components/EmptyState'
import { icons } from '../../constants'
import useAppwrite from '../../lib/useAppwrite'
import { useGlobalContext } from '../../context/GlobalProvider'
import { getUserPosts } from '../../lib/appwrite'
import InfoBox from '../../components/InfoBox'

const profile = () => {
  const {user,setUser,setIsLogged} = useGlobalContext();

  const {data:posts} = useAppwrite(()=>getUserPosts(user.$id));

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item)=>item.$id}
        renderItem={({item})=>(
          <VideoCard
            title={item.title}
            thumbnail={item.thumbnail}
            video={item.video}
            creator={item.creator.username}
            avatar={item.creator.avatar}
          />
        )}
        ListEmptyComponent={()=>(
          <EmptyState title="No video Found" subtitle="No Video found on this Profile"/>
        )}
        ListHeaderComponent={()=>(
          <View className="w-full flex justify-center  items-center mt-6 mb-12 px-4">
            <TouchableOpacity className="flex w-full  mb-10 items-end" >
              <Image
                source={icons.logout}
                resizeMode='contain'
                className="w-6 h-6"
              />
            </TouchableOpacity>
            <View className="flex w-16 h-16 border border-secondary rounded-lg justify-center items-center">
            <Image source={{uri:user?.avatar}}
              className="w-[90%] h-[90%]"
              resizeMode='contain'
            />
            </View>
            <InfoBox title={user?.username} containStyles ="mt-5" titleStyles="text-lg" />
            <View className="mt-5 flex flex-row">
              <InfoBox title={posts.length || 0} 
              subtitle="posts" titleStyles="Text-xl" containerStyles="mr-10" />
               <InfoBox
                title="1.2k"
                subtitle="Followers"
                titleStyles="text-xl"
              />
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  )
}

export default profile