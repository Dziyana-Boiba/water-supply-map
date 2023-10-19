import './loading.scss';

export const Loading = () => {
  return (
    <div className='overlay'>
      <svg
        class='spinner'
        width='70'
        height='70'
        viewBox='0 0 70 70'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <circle
          cx='35'
          cy='35'
          r='31'
          stroke='rgb(178, 178, 178)'
          stroke-width='8'
          fill='none'
        ></circle>
        <circle
          cx='35'
          cy='35'
          r='31'
          stroke='rgb(77, 77, 77)'
          stroke-width='4'
          fill='none'
        ></circle>
        <circle
          class='water'
          cx='35'
          cy='35'
          r='31'
          stroke='#29ABE2'
          stroke-width='4'
          fill='transparent'
          stroke-linecap='round'
        ></circle>
      </svg>
    </div>
  );
};
