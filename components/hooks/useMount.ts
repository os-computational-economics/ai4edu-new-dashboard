import { useEffect } from 'react';

// only run once when the component is mounted
const useMount = (func) => {
  useEffect(() => {
    func();
  }, []);
};

export default useMount;
