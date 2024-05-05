import { PageProps } from '@/.next/types/app/page';
import { EventFormat } from '@/helper/enums';
import { useEvents } from '@/store/events'
import { useRouter } from 'next/navigation';
import { EventTopic } from '@/store/events';
import React, { useEffect, useState } from 'react'
import { Badge } from "@/components/ui/badge";
import { all } from 'axios';
import { set } from 'date-fns';
import { setTimeout } from 'timers';

type SearchEvent = {
    pageSize: number,
    props: PageProps,
}

const EventTopicsFilter = ({ pageSize, props }: SearchEvent) => {
    const { searchEvents } = useEvents();
    const { setAllTopics, allTopics } = useEvents();
    const [name, setName] = useState("");
    const [topic, setTopic] = useState("");
    const [topicsChoice, setTopicsChoice] = useState<EventTopic[]>([]);
    const [topics, setTopics] = useState<EventTopic[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const pageNumber = props?.searchParams?.page || 1;
    const skip = (pageNumber - 1) * pageSize;

    const handleTopicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const topic = e.target.value.toLowerCase();
        setTopic(topic);
        if (topic === '') {
            setTopicsChoice(allTopics);
        } else {
            let topicsChoice_ = [];
            if (allTopics) {
                for (let i = 0; i < allTopics.length; i++) {
                    if (allTopics[i].name.toLowerCase().startsWith(topic)) {
                        if (topics.indexOf(allTopics[i]) === -1) {
                            topicsChoice_.push(allTopics[i]);
                        }
                    }
                }
            } else {
                setTopicsChoice([]);
            }
            setTopicsChoice(topicsChoice_);
        }
    }
    const handleTopicClick = (topic: EventTopic) => {
        let newTopics = [...topics, topic];
        console.log('aa');
        
        setTopics(newTopics);
        setTopic('');
        searchEvents({ topics: newTopics.map((t) => t.name), take: pageSize, skip: skip });
        console.log(newTopics.map((t) => t.name));
    }
    const deleteTopic = (topic: EventTopic) => {
        let newTopics = topics.filter((t) => t !== topic);
        setTopics(newTopics);
        searchEvents({ topics: newTopics.filter((t) => t !== topic).map((t) => t.name), take: pageSize, skip: skip });
    }

    useEffect(() => {
        searchEvents({ take: pageSize, skip: skip })
        setAllTopics();
    }, []);

    return (
        <div className='flex flex-col gap-4 w-[300px] absolute left-[50%] top-[-140px] translate-x-[-50%] bg-[var(--dark-blue)] p-5 rounded-[8px]'>
            <span className='text-white text-sm'>Looking for</span>
            <div className='relative w-[100%]'>
                <input
                    onChange={(e) => handleTopicChange(e)}
                    onFocus={() => { setTopicsChoice(allTopics); setIsOpen(true) }}
                    onBlur={() => setTimeout(() => setIsOpen(false), 5000) }
                    placeholder="Enter events topics"
                    name="topic"
                    value={topic}
                    autoComplete='off'
                    className='w-[100%] outline-none border-b text-white px-2 py-1 bg-transparent font-semibold'
                />
                {isOpen && topicsChoice.length !== 0 &&
                    <div className='w-[100%] absolute top-[30px] bg-white rounded-[8px] rounded-t-none border border-[var(--dark-blue)] shadow-md'>
                        {topicsChoice.map((topic: any) => (
                            <div key={topic.id} className='px-4 py-1 text-[14px] cursor-pointer hover:bg-slate-100 rounded-[inherit]' 
                                onClick={() => handleTopicClick(topic)}>
                                {topic.name}
                            </div>
                        ))}
                    </div>
                }
            </div>
        </div>
    )
}

export default EventTopicsFilter