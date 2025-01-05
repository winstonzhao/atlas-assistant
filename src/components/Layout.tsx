import { Box } from '@chakra-ui/react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box display="flex">
      <Sidebar />
      <Box ml="240px" flex={1}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
