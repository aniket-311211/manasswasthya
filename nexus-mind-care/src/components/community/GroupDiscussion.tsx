import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Send, Users, Circle } from 'lucide-react';
import { useCommunity, ChatMessage, ChatRoom } from '@/contexts/CommunityContext';
import { useUser } from '@clerk/clerk-react';
import { format, formatDistanceToNow } from 'date-fns';

interface DiscussionGroup {
    id: string;
    name: string;
    topic: string;
    description: string;
    participantCount: number;
    moderator: string;
    isJoined: boolean;
}

const GroupDiscussion: React.FC = () => {
    const { state, sendMessage, fetchMessages, setCurrentRoom, fetchChatRooms } = useCommunity();
    const { user } = useUser();
    const [selectedGroup, setSelectedGroup] = useState<DiscussionGroup | null>(null);
    const [messageText, setMessageText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Mock groups (will be replaced by API data)
    const groups: DiscussionGroup[] = [
        {
            id: 'group-1',
            name: 'Anxiety Support Circle',
            topic: 'Managing Daily Anxiety',
            description: 'A safe space to share experiences and coping strategies for anxiety.',
            participantCount: 24,
            moderator: 'Dr. Sharma',
            isJoined: false,
        },
        {
            id: 'group-2',
            name: 'Mindfulness Practice',
            topic: 'Daily Meditation Check-in',
            description: 'Share your meditation experiences and learn new techniques.',
            participantCount: 18,
            moderator: 'Priya Singh',
            isJoined: true,
        },
        {
            id: 'group-3',
            name: 'Student Wellness Hub',
            topic: 'Academic Stress Management',
            description: 'Discuss strategies for managing academic pressure and burnout.',
            participantCount: 32,
            moderator: 'Arjun Patel',
            isJoined: false,
        },
    ];

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [state.currentRoom?.messages]);

    const handleSelectGroup = async (group: DiscussionGroup) => {
        setSelectedGroup(group);
        // In a real app, this would fetch or create a chat room for this group
        setCurrentRoom({
            id: group.id,
            type: 'group',
            name: group.name,
            messages: [],
        });
    };

    const handleSendMessage = async () => {
        if (!messageText.trim() || !selectedGroup) return;
        await sendMessage(selectedGroup.id, messageText.trim());
        setMessageText('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleBack = () => {
        setSelectedGroup(null);
        setCurrentRoom(null);
    };

    // Chat view
    if (selectedGroup) {
        return (
            <div className="h-[600px] flex flex-col bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg border border-white/50 overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-gray-100 bg-white/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Button variant="ghost" size="sm" onClick={handleBack} className="p-2">
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                            <div>
                                <h3 className="font-semibold text-gray-900">{selectedGroup.name}</h3>
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                    <Users className="w-3 h-3" />
                                    <span>{selectedGroup.participantCount} members</span>
                                </div>
                            </div>
                        </div>
                        <Badge variant="secondary">{selectedGroup.topic}</Badge>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-blue-50/20 to-purple-50/20">
                    {(!state.currentRoom?.messages || state.currentRoom.messages.length === 0) ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="text-4xl mb-4">💬</div>
                            <h4 className="text-lg font-medium text-gray-900 mb-2">
                                Start the discussion
                            </h4>
                            <p className="text-gray-600 max-w-sm">
                                Be the first to share something with the group!
                            </p>
                        </div>
                    ) : (
                        state.currentRoom.messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className="max-w-xs lg:max-w-md">
                                    <div className="flex items-center space-x-2 mb-1">
                                        <span className="text-lg">{message.senderAvatar}</span>
                                        <span className="text-sm font-medium text-gray-700">{message.senderName}</span>
                                        <span className="text-xs text-gray-500">
                                            {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <div className="px-4 py-3 rounded-2xl bg-white border border-gray-200 shadow-sm">
                                        <p className="text-sm">{message.content}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-100 bg-white/50">
                    <div className="flex items-center space-x-3">
                        <Input
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Share with the group..."
                            className="flex-1"
                        />
                        <Button
                            onClick={handleSendMessage}
                            disabled={!messageText.trim()}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // Group list view
    return (
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {groups.map((group) => (
                <div
                    key={group.id}
                    className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg border border-white/50 overflow-hidden hover:shadow-xl transition-shadow"
                >
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <Badge variant="secondary" className="text-xs">
                                {group.topic}
                            </Badge>
                            {group.isJoined && (
                                <Badge className="bg-green-100 text-green-700 text-xs">Joined</Badge>
                            )}
                        </div>

                        <h3 className="font-bold text-gray-900 text-lg mb-2">{group.name}</h3>
                        <p className="text-gray-700 text-sm mb-4 leading-relaxed">{group.description}</p>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Active Members</span>
                                <span className="font-medium text-gray-900">{group.participantCount}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Moderator</span>
                                <span className="font-medium text-gray-900">{group.moderator}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                                <Circle className="w-2 h-2 bg-green-400 rounded-full" />
                                <span className="text-sm text-gray-600">{group.participantCount} online</span>
                            </div>
                        </div>

                        <Button
                            onClick={() => handleSelectGroup(group)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {group.isJoined ? 'Enter Discussion' : 'Join Group'}
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default GroupDiscussion;
