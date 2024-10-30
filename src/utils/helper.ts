// convert dateTimeEpoch to human readable date
const formatDateTimeEpoch = (dateTimeEpoch: number) => {
  const date = new Date(dateTimeEpoch);
  return date.toLocaleDateString();
};

const formatReceivedTime = (receivedTime: string) => {
  const currentDate = new Date();
  const receivedDate = new Date(receivedTime);

  const currentYear = currentDate.getFullYear();
  const receivedYear = receivedDate.getFullYear();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  if (currentYear === receivedYear) {
    // If the year is the current year, format as '10 Oct'
    const day = receivedDate.getDate();
    const month = monthNames[receivedDate.getMonth()];
    return `${day} ${month}`;
  } else {
    // If it's a different year, format as '10 Oct 2022'
    const day = receivedDate.getDate();
    const month = monthNames[receivedDate.getMonth()];
    const year = receivedYear;
    return `${day} ${month} ${year}`;
  }
};

const formatReceivedTimeFull = (receivedTime: string) => {
  const currentDate = new Date();
  const receivedDate = new Date(receivedTime);

  const currentYear = currentDate.getFullYear();
  const receivedYear = receivedDate.getFullYear();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // If it's a different year, format as '10 Oct 2022'
  const day = receivedDate.getDate();
  const month = monthNames[receivedDate.getMonth()];
  const year = receivedYear;
  return `${day} ${month} ${year}`;
};

const LABEL_CONFIG = [
  {
    color: '#f58c8c',
    label: 'General Breasties'
  },
  {
    color: '#AEDFF7',
    label: 'General Info'
  },
  {
    color: '#C9EAC8',
    label: 'In a trial'
  },
  {
    color: '#F8D7E9',
    label: 'Interested in a trial'
  },
  {
    color: '#FADAB8',
    label: 'Newly Diagnosed'
  },
  {
    color: '#E9E1F0',
    label: 'Partners'
  }
];
const getEmailLabel = (tag: string) => {
  const label = LABEL_CONFIG.find((label) => label.label === tag);
  return label;
};

const getAllEmailLabels = () => {
  return LABEL_CONFIG;
};

const convertTagsStringToArray = (tags: string | undefined) => {
  if (!tags) return [];

  return tags.split(',');
};

const convertcamelCaseToTitleCase = (camelCase: string) => {
  return camelCase.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
};

export {
  formatReceivedTime,
  getEmailLabel,
  getAllEmailLabels,
  convertTagsStringToArray,
  formatReceivedTimeFull,
  convertcamelCaseToTitleCase,
  formatDateTimeEpoch
};
