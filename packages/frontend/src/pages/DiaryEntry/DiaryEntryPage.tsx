import React, { useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import ReactMarkdown from 'react-markdown';
import { useParams } from 'react-router-dom';
import styled from 'styled-components/macro';
import { Layout } from '../../components/Layout';
import { Modal } from '../../components/Modal';
import { EditDiaryEntryForm } from '../DashBoard/components/EditDiaryEntryForm';

type DiaryEntry = {
  id: number;
  name: string;
  text: string;
  date: Date;
  createdAt: string;
  updatedAt: string;
  labels: Label[];
};
type Label = {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};
const LabelList = styled.ul`
  list-style: none;
  flex-grow: 1;
  font-size: 0.8rem;
  margin: 0;
  align-self: flex-end;
  display: flex;
  & > li {
    margin-right: 0.5rem;
    padding: 0.125rem;
    border-radius: 0.25rem;
    background-color: ${(props) => props.theme.colors.primary};
    display: block;
    color: #333;
  }
`;
const DiaryEntryFlex = styled.div`
  display: flex;
  align-items: center;
`;
const DiaryEntryHighLight = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  display: none;
  width: 4px;
  background-color: ${(props) => props.theme.colors.primary};
`;
const DiaryEntryName = styled.p`
  font-size: 2rem;
  font-weight: 1500;
  margin: 0;
`;

const DiaryEntryText = styled.p`
  font-size: 0.8rem;
  margin: 0;
`;
const DiaryEntryDate = styled.p`
  margin: 0;
  font-size: 0.8rem;
  color: ${(props) => props.theme.colors.secondaryFontColor};
`;

const DiaryEntryItemStyle = styled.div`
  min-height: 3rem;
  position: relative;
  padding: 0.7rem 2rem;

  &:hover {
    ${DiaryEntryHighLight} {
      display: block;
    }
  }

  background-color: whitesmoke;
  border-radius: 20px;
  margin: 30px 0 0;
`;

export const DiaryEntryPage = () => {
  let id = useParams().id;
  const [diaryEntry, setDiaryEntry] = useState<DiaryEntry | null>(null);
  const [weatherType, setWeatherType] = useState('');
  const [weatherIcon, setWeatherIcon] = useState('');
  const [editDiaryEntry, setEditDiaryEntry] = useState<DiaryEntry | null>(null);

  const fetchData = async () => {
    const dataRequest = await fetch(`/api/diary/${id}`, {
      headers: { 'content-type': 'application/json' },
    });
    const dataJson = await dataRequest.json();
    if (dataRequest.status === 200) {
      await setDiaryEntry(dataJson.data);
    }
    let dateString = dataJson.data.date.toString().slice(0, 10);
    const weatherRequest = await fetch(
      `/api/weather/${Number(dateString.slice(0, 4))}/${Number(dateString.slice(5, 7))}/${Number(
        dateString.slice(8, 10),
      )}`,
      {
        headers: { 'content-type': 'application/json' },
      },
    );
    const weatherJSON = await weatherRequest.json();
    setWeatherType(weatherJSON.weather_state);
    setWeatherIcon(weatherJSON.weather_icon);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (diaryEntry === null) return <h1>LOADING:....</h1>;
  else
    return (
      <Layout>
        <DiaryEntryItemStyle>
          <EditIcon
            css={`
              cursor: pointer;
            `}
            onClick={() => {
              setEditDiaryEntry(diaryEntry);
            }}
          />
          <DiaryEntryHighLight />
          <DiaryEntryFlex>
            <div>
              <DiaryEntryName>{diaryEntry.name}</DiaryEntryName>
              <ReactMarkdown>{diaryEntry.text}</ReactMarkdown>
              <DiaryEntryDate>{diaryEntry.date}</DiaryEntryDate>
              <DiaryEntryText>Weather today is : {weatherType}</DiaryEntryText>
              <img
                src={weatherIcon}
                alt={'icon weather'}
                css={`
                  width: 30px;
                `}
              />
            </div>
          </DiaryEntryFlex>
          <LabelList>
            {diaryEntry.labels.map((i) => {
              return <li key={i.id}>{i.name}</li>;
            })}
          </LabelList>
        </DiaryEntryItemStyle>
        {editDiaryEntry && (
          <Modal
            title="Edit Diary"
            onCancel={() => {
              setEditDiaryEntry(null);
            }}
          >
            <EditDiaryEntryForm
              afterSubmit={() => {
                setEditDiaryEntry(null);
                fetchData();
              }}
              diary={editDiaryEntry}
            />
          </Modal>
        )}
      </Layout>
    );
};
