import React from 'react';
import {Typography, Container, TextField, Box, Button, FormControlLabel, Checkbox } from '@material-ui/core';
import Panel from '../../components/BorderedPanel';
import Extensions from '../../components/Extensions';
import QuestStatus from './StatusSelect';
import {connect} from 'react-redux';

function mapStateToProps(state){
    return {
        extensions: state.quests.createExtensions

    }
}

const defaultQuest = { title: '', metaTitle: '', description: '', defaultStatus: '', show: { active: true, completed: true, failed: true } }

export default connect(mapStateToProps, null)(props=>{
    const [quest, setQuest] = React.useState(defaultQuest);
    const handleChange = (prop, val) => e => setQuest({...quest, [prop]: val?e:e.target.value });
    const handleCheckboxChange = k=>e=>setQuest({...quest, show: {...quest.show, [k]: e.target.checked  } });
    const handleAdd = e=>{
        window.cmd('quests_create', quest)
            .then(()=>window.cmd('quests_list'))
            // .then(list=>window.store.dispatch({ type: 'SET_PLUGIN_PROP', payload: { prop: 'list', value: list, plugin: 'quests' } }))
            .then(()=>setQuest(defaultQuest))
            .catch(console.error)
    }
    // const handleAdd = e=> console.log(quest);
    return (
        <Container maxWidth="sm">
            <Panel color="primary" title={window.i18n.quests.create}>
                <Box p={2}>
                    <TextField value={quest.title} fullWidth onChange={handleChange('title')} label={window.i18n.quests.questTitle} />
                    <TextField value={quest.metaTitle} fullWidth onChange={handleChange('metaTitle')} label={window.i18n.quests.questMetaTitle} />
                    <TextField value={quest.description} multiline fullWidth onChange={handleChange('description')} label={window.i18n.quests.description} />
                    <QuestStatus onChange={handleChange('defaultStatus', true)} status={quest.defaultStatus} />
                    <Typography align="center">{window.i18n.quests.whenVisible}</Typography>
                    {Object.keys(quest.show).map(k=>(
                        <FormControlLabel
                            key={k}
                            control={<Checkbox 
                                checked={quest.show[k]} 
                                onChange={handleCheckboxChange(k)}
                                />}
                            label={window.i18n.quests[k]}
                        />
                    ))}
                    <Extensions extensions={props.extensions} data={{ quest, setQuest }} />
                </Box>
                <Button onClick={handleAdd} variant="contained" color="primary" fullWidth>{window.i18n.quests.addQuest}</Button>

            </Panel>
        </Container>
    )
})