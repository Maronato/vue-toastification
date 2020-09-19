declare module "*?worker" {
  const WokerFactory: new () => Worker
  export default WokerFactory
}
