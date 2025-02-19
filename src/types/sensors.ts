export interface TypeSensorsProps {
    typeSensor: string,
    min: number,
    max: number,
}

export const sensorConfigs: Record<string, TypeSensorsProps> = {
    IBI: { typeSensor: "IBI", min: 0, max: 2 },
    HR: { typeSensor: "HR", min: 40, max: 180 }, //vai parecer quebrado enquanto nao estiver HR no banco..
    BVP: { typeSensor: "BVP", min: -0.3, max: 0.3 },
    EDA: {typeSensor: "EDA", min:0, max: 20},
    ACC: {typeSensor: "ACC", min:-5, max: 20},
    TEMP: {typeSensor: "TEMP", min:25, max:40},
  };