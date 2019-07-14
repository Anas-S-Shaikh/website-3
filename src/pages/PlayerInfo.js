import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { config } from '../';
import '../styles/pages/player-info.css';
import PlayerStatsRow from '../components/player/PlayerStatsRow';
import KillHistory from '../components/recent/KillHistory';
import MatchHistory from '../components/recent/MatchHistory';

class PlayerInfo extends Component {
  constructor() {
    super();

    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
  }

  state = {
    player: null,
    recentMatches: []
  };

  async componentDidMount(nextProps = { match: { params: { pid: null } } }) {
    let playerName = nextProps.match.params.pid || this.props.match.params.pid;
    let playerJson, playerRes;
    playerRes = await fetch(`${config.API_BASE}/mc/player/${playerName}`);
    if (!playerRes.ok)
      return console.error('Error fetching player: ' + playerRes.status);
    playerJson = await playerRes.json();
    this.setState({ player: playerJson });
    console.log(playerJson);

    let matchRes, matchJson;
    matchRes = await fetch(`${config.API_BASE}/mc/match/latest/${playerName}`);
    matchJson = await matchRes.json();
    this.setState({ recentMatches: matchJson });
  }

  async componentWillReceiveProps(nextProps) {
    this.setState({ player: null });
    await this.componentDidMount(nextProps);
  }

  render() {
    let { player } = this.state;
    return (
      <div className='player-info page'>
        <div className='container'>
          {!player && (
            <div className='center'>
              <CircularProgress />
            </div>
          )}
          {player && (
            <div>
              <PlayerStatsRow player={player} />
              <div className='row'>
                <div className='col-6'>
                  <div>Recent Kills</div>
                  <KillHistory
                    kills={player.deaths
                      .sort((a, b) => a.date - b.date)
                      .reverse()}
                  />
                </div>
                <div className='col-6'>
                  <div>Recent Matches</div>
                  <MatchHistory matches={this.state.recentMatches} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default PlayerInfo;
