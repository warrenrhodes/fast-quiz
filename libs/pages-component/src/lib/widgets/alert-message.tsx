import { MessageInstance } from 'antd/es/message/interface';

export const displayMessage = (
  message: string,
  messageType: 'success' | 'error',
  messageApi: MessageInstance
) => {
  if (messageType === 'success') {
    messageApi.success(message);
    return;
  }
  messageApi.error(message);
};
