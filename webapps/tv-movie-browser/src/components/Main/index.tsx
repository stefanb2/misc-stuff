import React, {useEffect} from 'react';
import {useParams} from 'react-router-dom';

import {useAppDispatch, useAppSelector } from '../../app/hooks';
import {programSelector, FETCH_PROGRAM} from '../../slices/program';
import {parseDate} from '../../utils/time';

type RouteParams = {
  date?: string
  providerId?: string
  selectorId?: string
}

export const Main = () => {
  const {date, providerId, selectorId} = useParams<RouteParams>()
  const program = useAppSelector(programSelector)
  const dispatch = useAppDispatch()

  useEffect(
    () => {
      // useEffect() callbacks should always be synchronous
      (async () => {
        const day = parseDate(date)
        dispatch(FETCH_PROGRAM({day, providerId, selectorId}))
      })()
    },
    [date, dispatch, providerId, selectorId]
  )

  return (
    <div>{JSON.stringify(program, undefined, 2)}</div>
  )
}
