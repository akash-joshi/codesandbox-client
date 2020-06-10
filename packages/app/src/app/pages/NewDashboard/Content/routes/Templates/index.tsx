import { useOvermind } from 'app/overmind';
import { Helmet } from 'react-helmet';
import React, { useEffect } from 'react';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/state';
import { Header } from 'app/pages/NewDashboard/Components/Header';
import {
  VariableGrid,
  SkeletonGrid,
} from 'app/pages/NewDashboard/Components/VariableGrid';
import { SelectionProvider } from 'app/pages/NewDashboard/Components/Selection';
import { getPossibleTemplates } from '../../utils';

export const Templates = () => {
  const {
    actions,
    state: {
      dashboard: { sandboxes, getFilteredSandboxes, activeTeam },
    },
  } = useOvermind();

  useEffect(() => {
    actions.dashboard.getPage(sandboxesTypes.TEMPLATES);
  }, [actions.dashboard]);

  const possibleTemplates = sandboxes.TEMPLATES
    ? getPossibleTemplates(sandboxes.TEMPLATES.map(t => t.sandbox))
    : [];

  const items =
    sandboxes.TEMPLATES &&
    getFilteredSandboxes(
      // @ts-ignore
      sandboxes.TEMPLATES.map(template => {
        const { sandbox, ...templateValues } = template;
        return {
          ...sandbox,
          type: 'sandbox',
          isTemplate: true,
          template: templateValues,
        };
      })
    );

  return (
    <SelectionProvider
      sandboxes={
        sandboxes.TEMPLATES &&
        sandboxes.TEMPLATES.map(template => {
          const { sandbox, ...templateValues } = template;
          return {
            ...sandbox,
            isTemplate: true,
            template: templateValues,
          };
        })
      }
    >
      <Helmet>
        <title>{activeTeam ? 'Team' : 'My'} Templates - CodeSandbox</title>
      </Helmet>
      <Header
        title="Templates"
        templates={possibleTemplates}
        showViewOptions
        showFilters
        showSortOptions
      />
      {sandboxes.TEMPLATES ? (
        <VariableGrid items={items} />
      ) : (
        <SkeletonGrid count={8} marginTop={8} />
      )}
    </SelectionProvider>
  );
};
