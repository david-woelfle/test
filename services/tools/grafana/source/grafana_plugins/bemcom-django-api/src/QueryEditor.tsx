import defaults from 'lodash/defaults';

import React, { ChangeEvent, PureComponent } from 'react';
import { Select, InlineFormLabel, LegacyForms } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { DataSource } from './DataSource';
import { defaultQuery, defaultQueryEntry, MyDataSourceOptions, MyQuery, MyQueryEntry } from './types';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Switch, Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';

import { getBackendSrv } from '@grafana/runtime';
const { FormField } = LegacyForms;

// const { FormField } = LegacyForms;

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

export class QueryEditor extends PureComponent<Props> {
  state = {
    showMeta: false,
    datapoint_options: [
      { label: 'example option 1', value: 1, description: 'example description' },
      { label: 'example option 2', value: 2, description: 'example description' },
      // { imgUrl: 'https://placekitten.com/40/40', },
    ],

    datatype_options: [
      { label: 'value', value: 0, description: 'timeseries of values' },
      { label: 'schedule', value: 1, description: 'currently active schedule' },
      { label: 'setpoint', value: 2, description: 'latest setpoint' },
    ],
    custom_user_scaling: [false],
    custom_user_name: [false],
    changed_input_style: (changed: boolean) => (changed ? { backgroundColor: 'darkslategrey' } : {}),
  };

  async componentDidMount() {
    console.log('componentDidMOunt - props:');
    console.log(this.props);
    // query backend meta to get options.
    try {
      const result = await getBackendSrv().datasourceRequest({
        method: 'GET',
        url: this.props.datasource.url + '/datapoint/',
      });

      let datapoint_options: any = [];

      result.data.forEach((option: any) => {
        datapoint_options.push({
          label: option.short_name,
          value: option.id,
          description: option.description,
        });

        this.setState({ datapoint_options });
      });
    } catch (error) {
      console.log('Error when requesting meta data from datasource: ', error);
    }
  }

  onMetaChange = (event: ChangeEvent<HTMLInputElement>, child: boolean) => {
    const { onChange, query, onRunQuery } = this.props;
    let s = { ...this.state };
    s.showMeta = child;
    this.setState({ s });
    onChange({ ...query, getMeta: child });
    onRunQuery();
  };

  onDatapointChange = (event: any, entry: MyQueryEntry) => {
    const { onChange, query, onRunQuery } = this.props;

    entry.datapoint = event;

    let entries = query.entries;
    entries[entry.id] = entry;
    onChange({ ...query, entries });
    onRunQuery();
  };

  onDatatypeChange = (event: any, entry: MyQueryEntry) => {
    const { onChange, query, onRunQuery } = this.props;

    entry.datatype = event;

    let entries = query.entries;
    entries[entry.id] = entry;
    onChange({ ...query, entries });
    onRunQuery();
  };

  onDisplayNameChange = (event: ChangeEvent<HTMLInputElement>, entry: MyQueryEntry) => {
    const { onChange, query } = this.props;

    // for updating state for colorful input tracking
    let custom_user_name = this.state.custom_user_name;
    custom_user_name[entry.id] = true;

    this.setState({ ...this.state, custom_user_name });

    entry.displayName = event.target.value;

    let entries = query.entries;
    entries[entry.id] = entry;
    onChange({ ...query, entries });
  };

  onScalingFactorChange = (event: ChangeEvent<HTMLInputElement>, entry: MyQueryEntry) => {
    const { onChange, query } = this.props;

    // for updating state for colorful input tracking
    let custom_user_scaling = this.state.custom_user_scaling;
    custom_user_scaling[entry.id] = true;

    this.setState({ ...this.state, custom_user_scaling });

    entry.scalingFactor = parseFloat(event.target.value);

    let entries = query.entries;
    entries[entry.id] = entry;
    onChange({ ...query, entries });
  };

  onUserMetaChange = (event: any, entry: MyQueryEntry) => {
    const { onRunQuery } = this.props;

    // for updating state for colorful input tracking
    let custom_user_scaling = this.state.custom_user_scaling;
    custom_user_scaling = custom_user_scaling.map((x) => false);
    let custom_user_name = this.state.custom_user_name;
    custom_user_name = custom_user_name.map((x) => false);
    this.setState({ ...this.state, custom_user_scaling, custom_user_name });
    onRunQuery();
  };

  // Managing queries
  renderQuery(entry: MyQueryEntry, getMeta: boolean) {
    return (
      <div style={{ position: 'relative' }}>
        <div className="gf-form-group" style={{ marginBottom: 0, marginTop: 0 }}>
          {/* First Row */}
          <div className="gf-form">
            <div className="gf-form" style={{ marginBottom: 0 }}>
              <InlineFormLabel
                width={10}
                tooltip="Select the datapoint to display. Options are loaded according to the meta data."
              >
                Select Datapoint
              </InlineFormLabel>
              <Select
                width={30}
                placeholder="Select datapoint"
                disabled={getMeta}
                value={entry.datapoint}
                maxMenuHeight={140}
                // defaultValue={this.state.datapoint_default}
                onChange={(e) => this.onDatapointChange(e, entry)}
                options={this.state.datapoint_options}
              />
            </div>
            <div className="gf-form" style={{ marginBottom: 0, marginLeft: 4 }}>
              <InlineFormLabel
                width={10}
                tooltip="Select the type of data to display. Options are defined according to BEMCom."
              >
                Select Data Type
              </InlineFormLabel>
              <Select
                width={30}
                placeholder="Select data type"
                disabled={getMeta}
                value={entry.datatype}
                maxMenuHeight={140}
                // defaultValue={this.state.datatype_options[0]}
                onChange={(e) => this.onDatatypeChange(e, entry)}
                options={this.state.datatype_options}
              />
            </div>
          </div>

          {/* Second Row */}

          <div className="gf-form" style={{ marginLeft: 20 }}>
            <span className="gf-form">
              <FormField
                style={this.state.changed_input_style(this.state.custom_user_name[entry.id])}
                label="displayName"
                disabled={getMeta}
                labelWidth={8}
                inputWidth={10}
                onChange={(e) => this.onDisplayNameChange(e, entry)}
                value={entry.displayName}
                placeholder=""
                tooltip="Custom name for this datapoint"
              />
              <FormField
                style={this.state.changed_input_style(this.state.custom_user_scaling[entry.id])}
                label="scalingFactor"
                disabled={getMeta}
                type="number"
                labelWidth={8}
                inputWidth={10}
                onChange={(e) => this.onScalingFactorChange(e, entry)}
                value={entry.scalingFactor}
                placeholder=""
                tooltip="Custom scaling factor for this datapoint"
              />
              <Button
                variant="contained"
                size="small"
                disabled={getMeta}
                onClick={(e) => this.onUserMetaChange(e, entry)}
              >
                apply
              </Button>
            </span>
          </div>
        </div>

        {/* Button on Right side */}

        <div style={{ position: 'absolute', top: 20, right: 20 }}>
          <Button
            style={{ backgroundColor: 'grey' }}
            variant="outlined"
            size="small"
            disabled={getMeta}
            onClick={(e) => this.deleteQuery(e, entry)}
          >
            <DeleteIcon />
          </Button>
          <Button
            style={{ backgroundColor: 'grey' }}
            variant="outlined"
            size="small"
            disabled={getMeta}
            onClick={(e) => this.addQuery(e, entry)}
          >
            <AddIcon />
          </Button>
        </div>
      </div>
    );
  }

  addQuery = (event: any, entry: MyQueryEntry) => {
    const { query, onChange } = this.props;

    let entries = query.entries;
    let defaultEntry: MyQueryEntry = { ...defaults(defaultQueryEntry) };
    defaultEntry.id = entry.id + 1;

    // for updating state for colorful input tracking
    let custom_user_scaling = this.state.custom_user_scaling;
    let custom_user_name = this.state.custom_user_name;

    // add new entry after the calling entry
    if (defaultEntry.id == entries.length) {
      entries.push(defaultEntry);
      custom_user_scaling.push(false);
      custom_user_name.push(false);
    } else {
      // shift all ids after new entry by one
      for (var i = entry.id + 1; i < entries.length; i++) {
        entries[i].id++;
      }

      entries.splice(entry.id + 1, 0, defaultEntry);
      custom_user_scaling.splice(defaultEntry.id, 0, false);
      custom_user_name.splice(defaultEntry.id, 0, false);
    }

    onChange({ ...query, entries });
    this.setState({ ...this.state, custom_user_scaling, custom_user_name });
  };

  deleteQuery = (event: any, entry: MyQueryEntry) => {
    const { query, onChange, onRunQuery } = this.props;

    let entries = query.entries;

    // for updating state for colorful input tracking
    let custom_user_scaling = this.state.custom_user_scaling;
    let custom_user_name = this.state.custom_user_name;

    // delete entry
    entries.splice(entry.id, 1);
    custom_user_scaling.splice(entry.id, 1);
    custom_user_name.splice(entry.id, 1);
    // shift id's of following entries by -1
    for (var i = entry.id; i < entries.length; i++) {
      entries[i].id--;
    }

    onChange({ ...query, entries });
    this.setState({ ...this.state, custom_user_scaling, custom_user_name });
    onRunQuery();
  };

  render() {
    const query = defaults(this.props.query, defaultQuery);
    const { getMeta, entries } = query;

    return (
      <div>
        <div className="gf-form" style={{ marginLeft: 0 }}>
          <FormControlLabel
            control={
              <Switch
                checked={getMeta}
                value={getMeta}
                onChange={this.onMetaChange}
                name="checkedMeta"
                color="primary"
                size="small"
              />
            }
            className="m-1"
            label="Show meta data"
          />
        </div>

        {query.entries.length == 0 && (
          <div className="gf-form-group">
            <Button
              style={{ backgroundColor: 'grey' }}
              variant="outlined"
              size="small"
              disabled={getMeta}
              onClick={(e) =>
                this.addQuery(e, {
                  id: -1,
                  datapoint: { label: '', value: 0, description: '' },
                  datatype: { label: '', value: 0, description: '' },
                  displayName: '',
                  scalingFactor: 1,
                })
              }
            >
              <AddIcon />
            </Button>
          </div>
        )}

        {entries.map((entry) => this.renderQuery(entry, getMeta))}
      </div>
    );
  }
}
