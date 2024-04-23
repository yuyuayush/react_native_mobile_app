import { View, Text, SafeAreaView, FlatList, Image, RefreshControl } from 'react-native'
import React from 'react'
import {images} from '../../constants';
import SearchInput from '../../components/SearchInput';
import Trending from '../../components/Trending';
import { getAllPosts, getLatestPosts } from '../../lib/appwrite';
import useAppwrite from '../../lib/useAppwrite';
import EmptyState from '../../components/EmptyState';
import VideoCard from '../../components/VideoCard';
const home = () => {
  const {data:posts,refetch} = useAppwrite(getAllPosts);
  const {data:latestPosts} = useAppwrite(getLatestPosts);
  posts.map((item)=>(
    console.log(item)
  ))
  return (
    <SafeAreaView className="bg-primary">
    <FlatList
    data={posts}
    keyExtractor={(item)=>item?.$id}
    renderItem={({item})=>(
      <VideoCard
            title={item.title}
            thumbnail={item.thumbnail}
            video={item.video}
            creator={item.creator?.username}
            avatar={item.creator?.avatar}
          />
    )}

    ListHeaderComponent={()=>(
        <View className="flex my-6 px-4 space-y-6 ">
        <View className="flex flex-row  justify-between items-start mb-6">

           <View className="">
            <Text className="font-pmedium text-sm text-gray-100">
              Welcome Back
            </Text>
            <Text className="text-2xl font-psemibold text-white">
              Ayush Negi
            </Text>
           </View>
           <View>
            <Image

              source={images.logoSmall}
              className="w-9 h-10" resizeMode='contain'
            />
           </View>
           </View>
        {/* </View> */}
        <SearchInput/>
        <View className="">
              <Text className="text-lg font-pregular text-gray-100 mb-3">
                Latest Videos is 
              </Text>
              <Trending posts={latestPosts ?? []}/>

        </View>
      </View>
    )}

    ListEmptyComponent={()=>(
      <EmptyState title="No video Found" subtitle="No video created yet" />
    )}
    // refreshControl={
    //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    // }

    />
    </SafeAreaView>
  )
}

export default home