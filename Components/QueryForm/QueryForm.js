import React from 'react';

import { PolyadicForm } from '../PolyadicForm';
import { ContinuumForm } from '../ContinuumForm';

import { logger } from '../../Utils';

export const QueryForm = ({ query, ...props }) => {
  const { responses, queryRule } = query;
  const { type } = queryRule;

  switch (type) {
    case 'polyadic':
      return (
        <PolyadicForm max={queryRule.max} responses={responses} {...props} />
      );

    case 'binary':
      return (
        <PolyadicForm max={1} responses={responses.slice(0, 2)} {...props} />
      );

    case 'continuum':
      return (
        <ContinuumForm
          steps={queryRule.steps}
          responses={responses.slice(0, 2)}
          {...props}
        />
      );

    default:
      logger.warn('Invalid query form type:', type);
      return null;
  }
};
