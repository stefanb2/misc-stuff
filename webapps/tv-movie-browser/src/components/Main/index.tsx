import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';

import {ErrorMessage} from '../ErrorMessage';

import {useAppDispatch, useAppSelector } from '../../app/hooks';
import {programSelector, FETCH_PROGRAM, FETCH_SELECTORS} from '../../slices/program';
import {parseDate} from '../../utils/time';

type RouteParams = {
  date?: string
  providerId?: string
  selectorId?: string
}

export const Main = () => {
  const {date, providerId, selectorId} = useParams<RouteParams>()
  const [error, updateError] = useState<Error>()
  const [initializing, updateInitializing] = useState<boolean>(true)
  const program = useAppSelector(programSelector)
  const dispatch = useAppDispatch()

  useEffect(
    () => {
      // useEffect() callbacks should always be synchronous
      (async () => {
        // provider ID changed -> re-initialize
        updateInitializing(true)

        try {
          await dispatch(FETCH_SELECTORS(providerId))
          updateInitializing(false)
        } catch (error) {
          updateError(error)
        }
      })()
    },
    [dispatch, providerId]
  )

  useEffect(
    () => {
      // useEffect() callbacks should always be synchronous
      (async () => {
        // wait until initializing is done
        if (initializing) return

        const day = parseDate(date)

        try {
          await dispatch(FETCH_PROGRAM({day, providerId, selectorId}))
        } catch (error) {
          updateError(error)
        }
      })()
    },
    [date, dispatch, initializing, providerId, selectorId]
  )

  if (error)
    return <ErrorMessage error={error} />

  return (
    <div>{JSON.stringify(program, undefined, 2)}</div>
  )
}
