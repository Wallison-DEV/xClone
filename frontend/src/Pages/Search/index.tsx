import { useEffect, useState } from 'react'

import * as S from './styles'
import { StyledHeader } from '../../Components/PostList/styles'

import Tweet from '../../Components/Tweet'
import Retweet from '../../Components/Retweet'
import UsersList from '../../Components/UsersList'

import { useFilterPostQuery, useFilterUserQuery } from '../../Services/api'

const Search = () => {
    const accessToken = localStorage.getItem("accessToken") || '';
    const [typeFilterPosts, setTypeFilterPosts] = useState(true)
    const [filter, setFilter] = useState(' ')
    const { data: filteredUsers, isLoading: loadingUsers, isSuccess } = useFilterUserQuery({ content: filter, accessToken });
    const { data: filteredPosts, isLoading: loadingPosts } = useFilterPostQuery({ content: filter, accessToken })

    useEffect(() => {
        console.log('filtered posts', filteredPosts)
    }, [isSuccess])
    return (
        <S.SearchContainer>
            <input type="text" placeholder='buscar' onChange={(e) => setFilter(e.target.value)} />
            <StyledHeader>
                <button onClick={() => setTypeFilterPosts(true)} className={typeFilterPosts === true ? 'is-selected' : ''}><p>Postagens</p></button>
                <button onClick={() => setTypeFilterPosts(false)} className={typeFilterPosts === false ? 'is-selected' : ''}><p>Usuários</p></button>
            </StyledHeader>
            {typeFilterPosts ? (
                <div>
                    {
                        loadingPosts ? (
                            <h1> Carregando</h1>
                        ) : (
                            <>
                                {filter && filteredPosts && filteredPosts.length > 0 ? (
                                    filteredPosts.map((post) => (
                                        <div key={post.id}>
                                            {('tweet_id' in post) ? (<Retweet props={post} />) : (<Tweet props={post} />)}
                                        </div>
                                    ))
                                ) : (
                                    <div className="container margin-top">Não há postagens disponíveis</div>
                                )
                                }
                            </>
                        )
                    }
                </div>
            ) : (
                <>
                    {
                        loadingUsers ? (
                            <h1> Carregando</h1>
                        ) : (
                            <>
                                {filter && filteredUsers && filteredUsers.length > 0 ? (
                                    <>
                                        <UsersList users={filteredUsers} followButton={false} />
                                    </>
                                ) : (
                                    <div className="container margin-top">Não há usuários disponíveis</div>
                                )
                                }
                            </>
                        )
                    }
                </>
            )}
        </S.SearchContainer >
    )
}

export default Search
