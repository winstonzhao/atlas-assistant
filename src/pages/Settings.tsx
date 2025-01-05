import { Box, Text, FormControl, FormLabel, Input, Button, useToast, VStack } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
const { ipcRenderer } = window.require('electron');

interface Settings {
  anthropicApiKey: string;
}

const Settings = () => {
  const [settings, setSettings] = useState<Settings>({ anthropicApiKey: '' });
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const savedSettings = await ipcRenderer.invoke('get-settings');
    setSettings(savedSettings);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await ipcRenderer.invoke('save-settings', settings);
      toast({
        title: 'Settings saved',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error saving settings',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
    setIsSaving(false);
  };

  return (
    <Box bg="gray.800" color="gray.100" p={8} minH="100vh">
      <Text fontSize="2xl" mb={6}>Settings</Text>
      <VStack spacing={6} align="stretch" maxW="600px">
        <FormControl>
          <FormLabel>Anthropic API Key</FormLabel>
          <Input
            type="password"
            value={settings.anthropicApiKey}
            onChange={(e) => setSettings({ ...settings, anthropicApiKey: e.target.value })}
            placeholder="Enter your Anthropic API key"
          />
        </FormControl>
        <Button
          colorScheme="blue"
          onClick={handleSave}
          isLoading={isSaving}
        >
          Save Settings
        </Button>
      </VStack>
    </Box>
  );
};

export default Settings;
