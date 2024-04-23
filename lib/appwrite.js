import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";// Init your react-native SDK
export const appwriteConfig ={
    endpoint:"https://cloud.appwrite.io/v1",
    platform:"com.jsm.aora",
    projectId:"66222b554e844e3084d1",
    databaseId:"66222e15b4569150e69b",
    userCollectionId:"66222eddd20759fcca87",
    videoCollectionId:"66222f0af20b6a3d5a27",
    storageId:"662232004548f142a779"
}

  const {endpoint,platform,projectId,databaseId,userCollectionId,videoCollectionId,storageId} = appwriteConfig;

    const client = new Client();
    client
        .setEndpoint(endpoint) // Your Appwrite Endpoint
        .setProject(projectId) // Your project ID
        .setPlatform(platform) // Your application ID or bundle ID.
    ;
    const account = new Account(client);
    const storage = new Storage(client);
    const avatars = new Avatars(client);
    const databases = new Databases(client);

      export async function getLatestPosts(){
        try {
          const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,[Query.orderDesc("$createdAt"),Query.limit(7)]
          );
          return posts.documents;
        } catch (error) {
          throw new Error(error);
        }
      }
    export async function getAllPosts(){
    try {
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.videoCollectionId
      ); 
      return posts.documents;
    } catch (error) {
      throw new Error(error);
    }
  }
// Register User
export async function createUser(email, password, username) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);
    await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    throw new Error(error);
  }
}
export async function signIn(email,password){
    try {
        const session = await account.createEmailSession(email,password);
        return session;
    } catch (error) {
        throw new Error(error);
    }
}
// Get Account
export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    throw new Error(error);
  }
}
// Get Current User

export async function getCurrentUser() {
    try {
        const currentAccount = await getAccount();
        if(!currentAccount)throw Error;
        const currentUser = await databases.listDocuments(databaseId,userCollectionId,[Query.equal('accountId',currentAccount.$id)]);
        if(!currentUser)throw Error;
        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
        return null;
    }
}
export async function getUserPosts (userId){
try {
  const posts = await databases.listDocuments(
    databaseId,
    videoCollectionId,
    [Query.equal("creator",userId)]
  );
  return posts.documents;
} catch (error) {
   throw new Error(error);
  
}
}
export async function signOut() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    throw new Error(error);
  }
}
export  async function createVideoPost(form){
  try {
    const [thumbnailUrl,videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ])
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId,
      }
    );

    return newPost;
  } catch (error) {
    throw new Error(error);
  }
}