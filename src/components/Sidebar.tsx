import { Box, VStack, Icon, Text, Flex } from '@chakra-ui/react';
import { IoChatboxOutline, IoSettingsOutline } from 'react-icons/io5';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const activeColor = 'purple.400';
  const inactiveColor = 'gray.500';

  const menuItems = [
    { icon: IoChatboxOutline, label: 'Chat', path: '/' },
    { icon: IoSettingsOutline, label: 'Settings', path: '/settings' },
  ];

  return (
    <Box
      as="nav"
      h="100vh"
      w="240px"
      bg="gray.900"
      p={4}
      position="fixed"
      left={0}
      top={0}
    >
      <VStack gap={4} alignItems="stretch" mt={8}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link to={item.path} key={item.path}>
              <Flex
                align="center"
                p={3}
                borderRadius="md"
                color={isActive ? activeColor : inactiveColor}
                _hover={{
                  bg: 'whiteAlpha.100',
                  color: activeColor,
                }}
                transition="all 0.2s"
              >
                <Icon as={item.icon} boxSize={5} mr={3} />
                <Text fontSize="md">{item.label}</Text>
              </Flex>
            </Link>
          );
        })}
      </VStack>
    </Box>
  );
};

export default Sidebar;
