export interface UniProfile {
    
    id: number;
    name: string;
    gender: string;
    age: number;
    color: string;
    firstSelected?: boolean;
    secondSelected?: boolean;
    loverId?: number;
    loverName?: string;
    childId?: number;
    childName?: string;
    isHeteroRelationship?: boolean;
    childFirstColor?: string;
    childSecondColor?: string;

}
