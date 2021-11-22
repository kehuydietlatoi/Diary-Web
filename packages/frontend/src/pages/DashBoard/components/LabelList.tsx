import { Label } from './DiaryEntriesList';
import React from 'react';

export function LabelList(props: { labels: Label[]; callbackfn: (i: Label) => JSX.Element }) {
  return <div>{props.labels.map(props.callbackfn)}</div>;
}
