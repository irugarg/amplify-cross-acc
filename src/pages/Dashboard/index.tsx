import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Form } from '@unform/web';
import { API, graphqlOperation } from 'aws-amplify';
import Observable from 'zen-observable';
import { FaSpinner } from 'react-icons/fa';
import { formatDistanceToNow, fromUnixTime } from 'date-fns';
import {
  Container,
  LeftSide,
  RightSide,
  ChimeList,
  Avatar,
  Content,
  HeaderContent,
  Teste,
  InfiniteScroll,
} from './styles';
import Input from '../../components/Input/index';
import Button from '../../components/Button';
import { createPost } from '../../graphql/mutations';
import { onCreatePost } from '../../graphql/subscriptions';
import { listPostsSortedByTimestamp } from '../../graphql/queries';
import { ListPostsSortedByTimestampQuery } from '../../API';
import profilePhoto from '../../assets/img/profile.jpg';
import { getDataChimeFromUser } from '../../models/User';

interface IPost {
  content: string;
  createdAt: string;
  id: string;
  owner: string | null;
  timestamp: number;
  type: string;
  updatedAt: string;
  timeFormatted: string;
  userData: {
    name: string;
    profileURL: string;
    email: string;
  };
}

const Dashboard: React.FC = () => {
  const [nextToken, setNextToken] = useState<string | null>('');
  const [isLoadingChime, setIsLoadingChime] = useState(true);
  const [isSendingPost, setIsSendingPost] = useState(false);
  const [chimes, setChimes] = useState<IPost[]>([] as IPost[]);
  const [scrollRadio, setScrollRadio] = useState(0);

  const scrollObserve = useRef<HTMLDivElement>(null);

  const calcDistanceToNow = (timestamp: any) => {
    const result2 = fromUnixTime(timestamp / 1000);
    const result = formatDistanceToNow(result2, {
      includeSeconds: true,
    });

    return result;
  };

  const intersectionObserver = new IntersectionObserver((entries) => {
    const radio = entries[0].intersectionRatio;
    setScrollRadio(radio);
  });

  const handleGetPosts = useCallback(async (nextToken = null) => {
    const res = (await API.graphql(
      graphqlOperation(listPostsSortedByTimestamp, {
        type: 'post',
        sortDirection: 'DESC',
        limit: 15,
        nextToken,
      }),
    )) as { data: ListPostsSortedByTimestampQuery };

    if (res.data.listPostsSortedByTimestamp)
      setNextToken(res?.data?.listPostsSortedByTimestamp?.nextToken);

    if (res.data?.listPostsSortedByTimestamp?.items) {
      // Para cada POST, pegar o owner, comparar com o User e instanciar a imagem do S3, retornando no POST
      // Lição de vida com Promise All e Alias, escrever aqui
      const chimesFormatted = await Promise.all(
        res.data.listPostsSortedByTimestamp.items.map(
          async (item): Promise<IPost> => {
            return {
              ...item,
              userData: await getDataChimeFromUser(item?.owner as string),
              timeFormatted: calcDistanceToNow(item?.timestamp as number),
            } as IPost;
          },
        ),
      );
      return chimesFormatted;
    }

    return [] as IPost[];
  }, []);

  const handleGetAdditionalPosts = useCallback(async () => {
    if (nextToken === null) return; // Reached the last page
    const additionalChimes = await handleGetPosts(nextToken);

    setChimes((prevState) => [...prevState, ...additionalChimes]);
  }, [handleGetPosts, nextToken]);

  useEffect(() => {
    let unsubscribe;

    handleGetPosts().then((result) => {
      setChimes(result);
      setIsLoadingChime(false);
    });
    // Here comes part 2
    const subscription = API.graphql(graphqlOperation(onCreatePost));
    if (subscription instanceof Observable) {
      const sub = subscription.subscribe({
        next: async (payload) => {
          try {
            const chime = {
              ...payload.value.data.onCreatePost,
              userData: await getDataChimeFromUser(
                payload.value.data.onCreatePost?.owner as string,
              ),
              timeFormatted: calcDistanceToNow(
                payload.value.data.onCreatePost.timestamp as number,
              ),
              // timeFormatted: payload.value.data.onCreatePost.timestamp,
            };
            setChimes((prevState) => [chime, ...prevState]);
          } catch (e) {
            console.log(e);
          }
        },
      });
      unsubscribe = () => {
        sub.unsubscribe();
      };
    }

    return unsubscribe;
  }, [handleGetPosts]);

  useEffect(() => {
    if (scrollObserve.current) {
      intersectionObserver.observe(scrollObserve.current);
    }

    return () => {
      intersectionObserver.disconnect();
    };
  }, [intersectionObserver]);

  useEffect(() => {
    if (scrollRadio === 1) {
      handleGetAdditionalPosts();
    }
  }, [handleGetAdditionalPosts, scrollRadio]);

  const handleSendPost = useCallback(async (data: { post: string }) => {
    setIsSendingPost(true);
    const res = (await API.graphql(
      graphqlOperation(createPost, {
        input: {
          type: 'post',
          content: data.post,
          timestamp: Date.now(),
        },
      }),
    )) as {
      data: {
        createPost: IPost;
      };
    };

    if (res) setIsSendingPost(false);
  }, []);

  return (
    <Container isLoading>
      <LeftSide>
        <Form onSubmit={handleSendPost}>
          <Input name="post" placeholder="Enter your post" />
          <Button type="submit" loading={isSendingPost}>
            Tweet
          </Button>
        </Form>
      </LeftSide>
      <RightSide>
        {isLoadingChime ? (
          <FaSpinner color="#FFF" size={14} />
        ) : (
            <Teste>
              <ChimeList>
                {chimes.map((chime) => (
                  <li key={chime.id}>
                    <Avatar>
                      <img
                        src={chime.userData.profileURL || profilePhoto}
                        alt="Profile"
                      />
                    </Avatar>
                    <Teste>
                      <HeaderContent>
                        <strong>
                          {chime.userData.name || chime.userData.email}
                        </strong>
                        <span>{`${chime.timeFormatted} ago`}</span>
                      </HeaderContent>
                      <Content>
                        <span>{chime.content}</span>
                      </Content>
                    </Teste>
                  </li>
                ))}
              </ChimeList>
              <InfiniteScroll ref={scrollObserve}>
                <FaSpinner color="#FFF" size={14} />
              </InfiniteScroll>
            </Teste>
          )}
      </RightSide>
    </Container>
  );
};

export default Dashboard;
