export interface FacebookInterface {
  id: string;
  first_name?: string;
  last_name?: string;
  picture: FacebookProfilePictureProps;
  email: string;
}

interface FacebookProfilePictureProps {
  data: {
    url: string;
  };
}
