import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';

import {ErrorMessage} from '../ErrorMessage';

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
  const [error, updateError] = useState<Error>()
  const program = useAppSelector(programSelector)
  const dispatch = useAppDispatch()

  useEffect(
    () => {
      // useEffect() callbacks should always be synchronous
      (async () => {
        const day = parseDate(date)

        try {
          await dispatch(FETCH_PROGRAM({day, providerId, selectorId}))
        } catch (error) {
          updateError(error)
        }
      })()
    },
    [date, dispatch, providerId, selectorId]
  )

  if (error)
    return <ErrorMessage error={error} />

  return (
    <div>{JSON.stringify(program, undefined, 2)}</div>
  )
}
