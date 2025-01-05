import {
  Box,
  Text,
  VStack,
  Input,
  Button,
  useToast,
  Flex,
  Textarea,
  Spinner,
} from '@chakra-ui/react';
import { useState, useEffect, useRef } from 'react';
import { Message, initializeAnthropicClient, sendMessage } from '../services/chat';

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const toast = useToast();

  useEffect(() => {
    initializeAnthropicClient().catch((error) => {
      toast({
        title: 'Error initializing chat',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessage([...messages, userMessage]);
      const assistantMessage: Message = { role: 'assistant', content: response };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      toast({
        title: 'Error sending message',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box bg="gray.800" color="gray.100" p={8} h="100vh" display="flex" flexDirection="column">
      <Text fontSize="2xl" mb={4}>Chat with Claude</Text>
      
      {/* Messages Area */}
      <VStack
        flex="1"
        overflowY="auto"
        spacing={4}
        align="stretch"
        mb={4}
        css={{
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'gray.500',
            borderRadius: '24px',
          },
        }}
      >
        {messages.map((message, index) => (
          <Box
            key={index}
            bg={message.role === 'user' ? 'blue.700' : 'gray.700'}
            p={4}
            borderRadius="lg"
            maxW="80%"
            alignSelf={message.role === 'user' ? 'flex-end' : 'flex-start'}
          >
            <Text whiteSpace="pre-wrap">{message.content}</Text>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </VStack>

      {/* Input Area */}
      <Flex>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          mr={2}
          resize="none"
          rows={2}
          bg="gray.700"
          disabled={isLoading}
        />
        <Button
          colorScheme="blue"
          onClick={handleSend}
          isLoading={isLoading}
          loadingText="Sending"
          minW="100px"
        >
          Send
        </Button>
      </Flex>
    </Box>
  );
};

export default Chat;
