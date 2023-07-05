// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {PokemonForm, fetchPokemon, PokemonDataView, PokemonInfoFallback} from '../pokemon'
import {ErrorBoundary} from 'react-error-boundary'

function PokemonInfo({state, setState, setError, error} = {}) {
  
  const [pokemon, setPokemon] = React.useState(null)
  // 🐨 Have state for the pokemon (null)
  React.useEffect(() => {
    if (!state.pokemonName) return
    setError(null)
    setPokemon(null)
    fetchPokemon(state.pokemonName)
      .then(pokemonData => {
        setPokemon(pokemonData)
        // setStatus('resolved')
        setState({...state, status: 'resolved'})
      })
      .catch(err => {
        setError(err)
        // setStatus('rejected')
        setState({...state, status: 'rejected'})
      })
  }, [state.pokemonName])

  React.useEffect(() => {
    if(state.status === 'rejected')throw error
  }, [state.status])
  // 🐨 use React.useEffect where the callback should be called whenever the
  // pokemon name changes.
  // 💰 DON'T FORGET THE DEPENDENCIES ARRAY!
  // 💰 if the pokemonName is falsy (an empty string) then don't bother making the request (exit early).
  // 🐨 before calling `fetchPokemon`, clear the current pokemon state by setting it to null.
  // (This is to enable the loading state when switching between different pokemon.)
  // 💰 Use the `fetchPokemon` function to fetch a pokemon by its name:
  //   fetchPokemon('Pikachu').then(
  //     pokemonData => {/* update all the state here */},
  //   )
  // 🐨 return the following things based on the `pokemon` state and `pokemonName` prop:
  //   1. no pokemonName: 'Submit a pokemon'
  //   2. pokemonName but no pokemon: <PokemonInfoFallback name={pokemonName} />
  //   3. pokemon: <PokemonDataView pokemon={pokemon} />

  // 💣 remove this
  // return 'TODO'
  if(!state.pokemonName) return 'Submit a pokemon'
  if(!pokemon) return <PokemonInfoFallback name={state.pokemonName} />
  return <PokemonDataView pokemon={pokemon} />
}

function App() {
  // const [pokemonName, setPokemonName] = React.useState('')
  const [error, setError] = React.useState(null)
  // const [status, setStatus] = React.useState('idle')
  const [state, setState] = React.useState({pokemonName: null, status: 'idle'})

  function handleSubmit(newPokemonName) {
    // setPokemonName(newPokemonName)
    // setStatus('pending')
    setState({pokemonName: newPokemonName, status: 'pending'})
  }

  return (
    <div className="pokemon-info-app">
        <PokemonForm 
          pokemonName={state.pokemonName} 
          onSubmit={handleSubmit} 
        />
        <hr />
        <div className="pokemon-info">
          <ErrorBoundary key={state.pokemonName} fallback={
            <div role="alert">
              {console.log(state)}
              {state.status==='rejected' ? 'There was an error: ' : ''}
              <pre style={{whiteSpace: 'normal'}}>
                {error?.message}
              </pre>
            </div>
          }>
            <PokemonInfo 
              // pokemonName={pokemonName}   
              state={state}
              setState={setState}
              setError={setError} 
              error={error}
              // status={status}
              // setStatus={setStatus}
            />
          </ErrorBoundary>
        </div>
      
      {/* <div role="alert">
        {console.log(state)}
        {state.status==='rejected' ? 'There was an error: ' : ''}
        <pre style={{whiteSpace: 'normal'}}>
          {error?.message}
        </pre>
      </div> */}
    </div>
  )
}

// class ErrorBoundary extends React.Component {
//   state = {error: null}
//   static getDerivedStateFromError(error) {
//     return {error}
//   }
//   render() {
//     const {error} = this.state
//     if (error) {
//       return this.props.fallback
//     }

//     return this.props.children
//   }
// }

export default App
