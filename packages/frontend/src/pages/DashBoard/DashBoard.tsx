import React, { ChangeEvent, useEffect, useState } from 'react';
import { DiaryEntry, DiaryEntryItem, Label } from './components/DiaryEntriesList';
import { GlobalStyle } from '../../components/GlobalStyle';
import { Layout } from '../../components/Layout';
import { AddButton } from './components/AddButton';
import { Modal } from '../../components/Modal';
import { AddDiaryEntryForm } from './components/AddDiaryEntryForm';
import { EditDiaryEntryForm } from './components/EditDiaryEntryForm';
import { Button } from '../../components/Button';
import { Chip } from '@mui/material';
import { LabelList } from './components/LabelList';
import { SearchBar } from './components/SearchBar';
import { AddNewLabel } from './components/AddNewLabel';

// problem when click too fast , icon cant load so receive warning leaked memory
export const DashBoard = () => {
  // all data diaries for rendering
  const [dataDiaryEntries, setDataDiaryEntries] = useState<DiaryEntry[]>([]);
  // store all data from diaries, so we dont need to fetch data after everytime search bar is changed
  const [storingDataDiaryEntries, setStoringDataDiaryEntries] = useState<DiaryEntry[]>([]);
  const [dataLabels, setDataLabels] = useState<Label[]>([]);
  const [addDiaryEntryVisible, setAddDiaryEntryVisible] = useState(false);
  const [editDiaryEntry, setEditDiaryEntry] = useState<DiaryEntry | null>(null);
  const [newLabel, setNewLabel] = useState<string>('');
  const [filterSearch, setFilterSearch] = useState('name');

  const fetchData = async () => {
    const diaryEntryRequest = await fetch('/api/diary');
    if (diaryEntryRequest.status == 200) {
      const diaryJson = await diaryEntryRequest.json();
      setDataDiaryEntries(diaryJson.data);
      setStoringDataDiaryEntries(diaryJson.data);
    }
    const labelRequest = await fetch('/api/label');
    if (labelRequest.status == 200) {
      const labelsJson = await labelRequest.json();
      setDataLabels(labelsJson.data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const searchFieldDidChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value == '') fetchData();
    switch (filterSearch) {
      case 'name':
        setDataDiaryEntries(
          storingDataDiaryEntries.filter((i) =>
            i.name.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase()),
          ),
        );
        break;
      case 'label':
        setDataDiaryEntries(
          storingDataDiaryEntries.filter((i) =>
            i.labels.some((label: Label) =>
              label.name.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase()),
            ),
          ),
        );
        break;
      case 'date':
        setDataDiaryEntries(
          storingDataDiaryEntries.filter((i) => i.date.toString().slice(0, 10).includes(e.target.value)),
        );
        break;
    }
  };
  const handleClick = async (i: number) => {
    const selectDiaryEntriesByLabelRequest = await fetch(`/api/label/${i}/diary`, { method: 'get' });
    if (selectDiaryEntriesByLabelRequest.status == 200) {
      const diaryJson = await selectDiaryEntriesByLabelRequest.json();
      setDataDiaryEntries(diaryJson.data);
      setStoringDataDiaryEntries(diaryJson.data);
    }
  };
  const handleDelete = async (i: number) => {
    const deleteLabelRequest = await fetch(`/api/label/${i}`, { method: 'delete' });
    if (deleteLabelRequest.status == 200) {
      fetchData();
    }
  };

  const handleLabelChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewLabel(e.target.value);
  };
  const handleFilterSearchChange = (e: any) => {
    setFilterSearch(e.target.value);
  };
  const addNewLabel = async () => {
    if (newLabel === '') {
      alert("Label can't be null !!!");
      return;
    }
    const newLabelRequest = await fetch(`/api/label`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newLabel }),
    });
    if (newLabelRequest.status == 200) {
      fetchData();
    }
  };
  const saveToFile = (csv: string) => {
    const element = document.createElement('a');
    //ts-ignore
    const file = new Blob([csv], { type: 'text/csv' });
    element.href = URL.createObjectURL(file);
    element.download = 'output.csv';
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };
  const download = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const csvRes = await fetch(`/api/diary/csv`, {
      method: 'get',
    });
    if (csvRes.status === 200) {
      // @ts-ignore
      const reader = csvRes.body.getReader();
      const result = await reader.read();
      const decoder = new TextDecoder('utf-8');
      const csv = decoder.decode(result.value);
      saveToFile(csv);
    }
  };

  if (dataDiaryEntries === null) return <h1>Loading...</h1>;
  return (
    <>
      <GlobalStyle />
      <Layout>
        <h1
          css={`
            text-align: center;
          `}
        >
          All diaries
        </h1>

        <Button onClick={download}>download as csv</Button>
        <AddNewLabel onChange={handleLabelChange} value={newLabel} onClick={addNewLabel} />
        <LabelList
          labels={dataLabels}
          callbackfn={(i) => {
            return (
              <Chip label={i.name} key={i.id} onClick={() => handleClick(i.id)} onDelete={() => handleDelete(i.id)} />
            );
          }}
        />
        <SearchBar
          onChangeSearchField={searchFieldDidChange}
          value={filterSearch}
          onChangeFilter={handleFilterSearchChange}
        />
        <div
          css={`
            display: flex;
            flex-direction: row;
            width: 100%;
          `}
        >
          <div
            css={`
              flex: 1;
              justify-content: flex-end;
              display: flex;
              align-items: center;
            `}
          >
            <AddButton
              onClick={() => {
                if (!editDiaryEntry) {
                  setAddDiaryEntryVisible(true);
                }
              }}
            />
          </div>
        </div>
        {addDiaryEntryVisible && (
          <Modal
            title="Add a new Diary Entry"
            onCancel={() => {
              setAddDiaryEntryVisible(false);
            }}
          >
            <AddDiaryEntryForm
              afterSubmit={() => {
                setAddDiaryEntryVisible(false);
                fetchData();
              }}
            />
          </Modal>
        )}
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
        {dataDiaryEntries.map((i) => {
          return (
            <DiaryEntryItem
              diaryEntry={i}
              key={i.id}
              onClick={() => {
                if (!addDiaryEntryVisible) {
                  setEditDiaryEntry(i);
                }
              }}
            />
          );
        })}
      </Layout>
    </>
  );
};
