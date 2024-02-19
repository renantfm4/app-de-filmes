import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Dimensions, Platform, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { ChevronLeftIcon, HeartIcon } from 'react-native-heroicons/outline';
import { styles, theme } from '../theme';
import { LinearGradient } from 'expo-linear-gradient';
import Cast from '../components/cast';
import MovieList from '../components/movieList';
import Loading from '../components/loading';
import { fallbackMoviePoster, fetchMovieCredits, fetchMovieDetails, fetchSimilarMovies, image500 } from '../api/moviedb';

var {width, height} = Dimensions.get('window');
const ios = Platform.OS == "ios"
const topMargin = ios? '': ' mt-3';

export default function MovieScreen() {
    const {params: item} = useRoute();
    const [isFavourite, toggleFavourite] = useState(false);
    const navigation = useNavigation();
    const [cast, setCast] = useState([])
    const [similarMovies, setSimilarMovies] = useState([1,2,3,4,5])
    const [loading, setLoading] = useState(false)
    const [movie, setMovie] = useState({})
    let movieName = 'Ant-Man and the Wasp: Quantumania'
    useEffect(() => {
        setLoading(true)
        getMovieDetails(item.id)
        getMovieCredits(item.id)
        getSimilarMovies(item.id)
    }, [item])

    const getMovieDetails = async id => {
        const data = await fetchMovieDetails(id);
        if(data) setMovie(data)
        setLoading(false);
    }

    const getMovieCredits = async id => {
        const data = await fetchMovieCredits(id);
        if(data && data.cast) setCast(data.cast)
    }

    const getSimilarMovies = async id => {
        const data = await fetchSimilarMovies(id);
        if(data && data.results) setSimilarMovies(data.results)
    }
    return (
        <ScrollView
            contentContainerStyle={{paddingBottom: 20}}
            className="flex-1 bg-neutral-900"
        >
            {/* botao de voltar e poster do filme */}
            <View className="w-full">
                <SafeAreaView style={{ flexDirection: 'row', justifyContent: 'space-between' }} className={ios? topMargin : "absolute z-20 w-full flex-row justify-between items-center px-4"}>
                    <View style={{ marginTop: 40 }}>
                        <TouchableOpacity onPress={() => navigation.navigate('Home')}style={styles.background} className="rounded-xl p-1">
                            <ChevronLeftIcon size="28" strokeWidth={2.5} color="white"/>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity onPress={()=> toggleFavourite(!isFavourite)}>
                            <HeartIcon style={{marginTop: 40}} size="35" color={isFavourite? theme.background : "white"}/>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
                {
                    loading? (
                        <Loading/>
                    ):(
                <View>
                    <Image
                        // source={require('../assets/images/moviePoster2.png')}
                        source={{uri: image500(movie?.poster_path) || fallbackMoviePoster}}
                        style={{width, height: height*0.55}}
                    />
                    <LinearGradient
                        colors={['transparent', 'rgba(23,23,23,0.8)', 'rgba(23,23,23, 1)']}
                        style={{width, height: height*0.40}}
                        start={{x: 0.5, y: 0}}
                        end={{x: 0.5, y: 1}}
                        className="absolute bottom-0"
                    />
                </View>
                    )
                }
                
            </View>

            {/* detalhes do filme */}
            <View style={{marginTop: -(height*0.09)}} className="space-y-3">
                {/*titulo */}
                <Text className="text-white text-center text-3xl font-bold tracking-wider">
                    {
                        movie?.title
                    }
                </Text>
                {/* status, lançamento e tempo de filme */}
                {
                    movie?.id?(
                <Text className="text-neutral-400 font-semibold text-base text-center">
                    {movie?.status} * {movie?.release_date?.split('-')[0]} * {movie?.runtime} min
                </Text>
                    ):null
                }
                

                {/* Genêro */}
                <View className="flex-row justify-center mx-4 space-x-2">
                    {
                        movie?.genres?.map((genre, index) => {
                            let showDot = index+1 != movie.genres.length;
                            return (
                                <Text key={index} className="text-neutral-400 font-semibold text-base text-center">
                                     {genre?.name} {showDot? "*":null}
                                </Text>
                            )
                        })
                    }
                    
                    {/*<Text className="text-neutral-400 font-semibold text-base text-center">
                        Thrill *
                    </Text>
                    <Text className="text-neutral-400 font-semibold text-base text-center">
                        Comedy
                    </Text>*/}
                </View>
                {/* descrição */}
                <Text className="text-neutral-400 mx-4 tracking-wide">
                    {
                        movie?.overview
                    }
                </Text>
            </View>

            {/* elenco */}
            <Cast navigation={navigation} cast={cast} />

            {/* Filmes semelhantes */}
            {/* <MovieList title="Similar Movies" hideSeeAll={true} data={similarMovies}/> */}
        </ScrollView>
    )
}
