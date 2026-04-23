import axiosInstance from './axiosInstance';

export const getAllSongs = async () => {
  try {
    const response = await axiosInstance.get('/layug/songs');
    return response.data;
  } catch (error) {
    console.error('Error fetching songs:', error);
    throw error;
  }
};

export const getSongById = async (id) => {
  try {
    const response = await axiosInstance.get(`/layug/songs/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching song ${id}:`, error);
    throw error;
  }
};

export const searchSongs = async (query) => {
  try {
    const response = await axiosInstance.get(`/layug/songs/search/${query}`);
    return response.data;
  } catch (error) {
    console.error('Error searching songs:', error);
    throw error;
  }
};

export const addSong = async (songObj) => {
  try {
    const response = await axiosInstance.post('/layug/songs', {
      title: songObj.title,
      artist: songObj.artist,
      album: songObj.album,
      genre: songObj.genre,
      url: songObj.url,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding song:', error);
    throw error;
  }
};

export const updateSong = async (id, songObj) => {
  try {
    const response = await axiosInstance.put(`/layug/songs/${id}`, songObj);
    return response.data;
  } catch (error) {
    console.error(`Error updating song ${id}:`, error);
    throw error;
  }
};

export const deleteSong = async (id) => {
  try {
    const response = await axiosInstance.delete(`/layug/songs/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting song ${id}:`, error);
    throw error;
  }
};