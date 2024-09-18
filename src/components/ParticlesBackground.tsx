import { Particles } from '@tsparticles/react';

import { lightTheme, darkTheme } from "../themes";

interface Props {
  themeName: string;
}

export const ParticlesBackground = ({themeName}: Props) => {

  return (
    <Particles
      style={{
        position: 'relative',
        zIndex: 0      
      }}

      options={{
        background: {
          color: (themeName === 'dark') ? darkTheme.bg : lightTheme.bg,
          position: '50% 50%',
          repeat: 'no-repeat',
          size: 'cover'
        },
        backgroundMask: {
          cover: {
            color: '#d4ecdd'
          }
        },
        fullScreen: {zIndex: 1},
        interactivity: {
          events: {
            onClick: {
              enable: true,
              mode: 'repulse'
            },
            onHover: {
              enable: true,
              mode: 'bubble'
            }
          },
          modes: {
            bubble: {
              distance: 400,
              duration: 0.3,
              opacity: 1,
              size: 4
            },
            grab: {
              distance: 400,
              links: {
                opacity: 0.5
              }
            }
          }
        },
        particles: {
          color: {
            value: (themeName === "dark") ? darkTheme.text : lightTheme.text
          },
          move: {
            attract: {
              rotate: {
                x: 600,
                y: 1200
              }
            },
            direction: 'bottom',
            enable: true,
            path: {},
            outModes: 'out',
            spin: {},
          },
          number: {
            density: {
              enable: true
            },
            value: 10
          },
          opacity: {
            value: {
              min: 0.1,
              max: 0.5
            },
            animation: {
              enable: true,
              speed: 1,
              mode: 'random',
              startValue: 'min'
            }
          },
          size: {
            value: {
              min: 1,
              max: 10
            },
            animation: {
              enable: true,
              speed: 40,
              mode: 'random',
              startValue: 'min'
            }
          }
        }
      }}
    />
  );
}
