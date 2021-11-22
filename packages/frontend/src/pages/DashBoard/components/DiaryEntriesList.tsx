import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components/macro';
import { Button } from '../../../components/Button';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import EditIcon from '@mui/icons-material/Edit';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
export type DiaryEntry = {
  id: number;
  name: string;
  text: string;
  date: Date;
  createdAt: string;
  updatedAt: string;
  labels: Label[];
};
export type Label = {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};
export type DiaryEntryItemProps = {
  diaryEntry: DiaryEntry;
  onClick?: (diary: DiaryEntry) => void;
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

export const DiaryEntryItem: React.FC<DiaryEntryItemProps> = ({ diaryEntry, onClick = () => undefined }) => {
  const { id, name, text, date, createdAt, updatedAt, labels } = diaryEntry;
  let dateString = date.toString().slice(0, 10);
  const year: number = Number(dateString.slice(0, 4));
  const month: number = Number(dateString.slice(5, 7));
  const day: number = Number(dateString.slice(8, 10));
  let navigate = useNavigate();
  return (
    <DiaryEntryItemStyle>
      <EditIcon
        css={`
          cursor: pointer;
        `}
        onClick={() => {
          onClick(diaryEntry);
        }}
      />
      <ReadMoreIcon
        css={`
          cursor: pointer;
          float: right;
        `}
        onClick={() => navigate(`/diary/${id}`)}
      />
      <DiaryEntryHighLight />
      <DiaryEntryFlex>
        <div>
          <DiaryEntryName>{name}</DiaryEntryName>
          <DiaryEntryDate>{dateString}</DiaryEntryDate>
        </div>
      </DiaryEntryFlex>
      <LabelList>
        {labels.map((i) => {
          return <li key={i.id}>{i.name}</li>;
        })}
      </LabelList>
    </DiaryEntryItemStyle>
  );
};
