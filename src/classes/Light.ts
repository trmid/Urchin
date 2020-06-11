/// <reference path="./Color.ts" />
/// <reference path="./Trigon.ts" />

interface Light {
    color: Color;
    brightness: number;
    intensityOn(t: Trigon): number;
}