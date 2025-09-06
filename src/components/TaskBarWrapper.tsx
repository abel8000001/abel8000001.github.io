import { List, TaskBar, TitleBar } from "@react95/core"
import '../styles/TaskBarWrapper.css'

import githubIcon from '../assets/github-logo.svg';
import instagramIcon from '../assets/instagram-logo.svg';

function TaskBarWrapper() {
    return (
        <TaskBar
                list={
                    <List>
                        <TitleBar title='Made with <3 by Abel' />
                        <a href='https://github.com/abel8000001' target='_blank' rel='noopener noreferrer'>
                            <List.Item className='taskbarIcon' id='github' icon={<img src={githubIcon} alt="GitHub" />}>
                                abel8000001
                            </List.Item>
                        </a>
                        <a href='https://www.instagram.com/abel8000000/' target='_blank' rel='noopener noreferrer'>
                            <List.Item className='taskbarIcon' id='instagram' icon={<img src={instagramIcon} alt="Instagram" />}>
                                abel8000000
                            </List.Item>
                        </a>
                    </List>
                }
            />
    )
}

export default TaskBarWrapper