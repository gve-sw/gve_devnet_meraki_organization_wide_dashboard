import React, { useState, useEffect, useMemo } from 'react'; // Import useMemo
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import { setApiKey as setApiKeyInBackend, fetchNetworkEvents, fetchOrganizations, fetchNetworks } from '../../../../services/merakiService';
import { DataGrid } from '@mui/x-data-grid'; // Import DataGrid
import PropTypes from 'prop-types';

// NetworkList component
function NetworkList({ orgId, onNetworkSelectionChange }) {
    const [networks, setNetworks] = useState([]);
    const [selectedNetworks, setSelectedNetworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadNetworks = async () => {
            try {
                setLoading(true);
                const networkData = await fetchNetworks(orgId);
                setNetworks(networkData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (orgId) {
            loadNetworks();
        }
    }, [orgId]);

    const handleCheckboxChange = (networkId) => {
        setSelectedNetworks((prevSelectedNetworks) => {
            if (prevSelectedNetworks.includes(networkId)) {
                return prevSelectedNetworks.filter((id) => id !== networkId);
            } else {
                return [...prevSelectedNetworks, networkId];
            }
        });
    };

    const handleSelectAllChange = () => {
        if (selectedNetworks.length === networks.length) {
            setSelectedNetworks([]);
        } else {
            const allNetworkIds = networks.map((network) => network.id);
            setSelectedNetworks(allNetworkIds);
        }
    };

    useEffect(() => {
        onNetworkSelectionChange(selectedNetworks);
    }, [selectedNetworks, onNetworkSelectionChange]);

    if (loading) {
        return (
            <div>
                <p>Loading networks...</p>
            </div>
        );
    }

    if (error) {
        return <div>Error loading networks: {error}</div>;
    }

    return (
        <div>
            <label>
                <Checkbox
                    checked={selectedNetworks.length === networks.length}
                    onChange={handleSelectAllChange}
                />{' '}
                Select All
            </label>
            {networks.map((network) => (
                <div key={network.id}>
                    <Checkbox
                        checked={selectedNetworks.includes(network.id)}
                        onChange={() => handleCheckboxChange(network.id)}
                    />
                    {network.name}
                </div>
            ))}
        </div>
    );
}

NetworkList.propTypes = {
    orgId: PropTypes.string.isRequired,
    onNetworkSelectionChange: PropTypes.func.isRequired,
};

// OrgList component
function OrgList({ apiKey, setSelectedOrg }) {
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadOrganizations = async () => {
            try {
                if (!apiKey) {
                    setError('API key is missing.');
                    return;
                }

                const data = await fetchOrganizations(apiKey);
                setOrganizations(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadOrganizations();
    }, [apiKey]);

    const handleOrgClick = (orgId) => {
        setSelectedOrg(orgId);
    };

    if (loading) {
        return <div>Loading organizations...</div>;
    }

    if (error) {
        return <div>Error loading organizations: {error}</div>;
    }

    return (
        <div>
            <List>
                {organizations.map((org) => (
                    <ListItem key={org.id} button onClick={() => handleOrgClick(org.id)}>
                        <ListItemText primary={org.name} />
                    </ListItem>
                ))}
            </List>
        </div>
    );
}

OrgList.propTypes = {
    apiKey: PropTypes.string.isRequired,
    setSelectedOrg: PropTypes.func.isRequired,
};

// EventsTable component
function EventsTable({ events, onEventSelect }) {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [searchQuery, setSearchQuery] = useState('');

    const sortedAndFilteredEvents = useMemo(() => {
        return [...events]
            .filter(event => {
                return Object.values(event).some(value =>
                    String(value).toLowerCase().includes(searchQuery.toLowerCase())
                );
            })
            .sort((a, b) => {
                if (sortConfig.key !== null) {
                    if (a[sortConfig.key] < b[sortConfig.key]) {
                        return sortConfig.direction === 'ascending' ? -1 : 1;
                    }
                    if (a[sortConfig.key] > b[sortConfig.key]) {
                        return sortConfig.direction === 'ascending' ? 1 : -1;
                    }
                }
                return 0;
            });
    }, [events, sortConfig, searchQuery]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    return (
        <div>
            <h2>Network Events</h2>
            <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <table>
                <thead>
                    <tr>
                        <th onClick={() => requestSort('occurred_at')}>Occurred At</th>
                        <th onClick={() => requestSort('network_id')}>Network ID</th>
                        <th onClick={() => requestSort('type')}>Event Type</th>
                        <th onClick={() => requestSort('description')}>Description</th>
                        <th onClick={() => requestSort('category')}>Category</th>
                        <th onClick={() => requestSort('client_id')}>Client ID</th>
                        <th onClick={() => requestSort('client_description')}>Client Description</th>
                        <th onClick={() => requestSort('client_mac')}>Client MAC</th>
                        <th onClick={() => requestSort('device_serial')}>Device Serial</th>
                        <th onClick={() => requestSort('device_name')}>Device Name</th>
                        <th onClick={() => requestSort('ssid_number')}>SSID Number</th>
                        <th>Event Details</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedAndFilteredEvents.map((event, index) => (
                        <tr key={index}>
                            <td>{event.occurred_at}</td>
                            <td>{event.network_id}</td>
                            <td>{event.type}</td>
                            <td>{event.description}</td>
                            <td>{event.category}</td>
                            <td>{event.client_id}</td>
                            <td>{event.client_description}</td>
                            <td>{event.client_mac}</td>
                            <td>{event.device_serial}</td>
                            <td>{event.device_name}</td>
                            <td>{event.ssid_number}</td>
                            <td>
                                <button 
                                    onClick={() => onEventSelect(event)}>
                                    Expand
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

EventsTable.propTypes = {
    events: PropTypes.arrayOf(PropTypes.object).isRequired,
    onEventSelect: PropTypes.func.isRequired,
};

// Main AppPage component
function AppPage() {
    const [apiKey, setApiKeyState] = useState('');
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [apiKeySubmitted, setApiKeySubmitted] = useState(false);
    const [selectedNetworks, setSelectedNetworks] = useState([]);
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [organizations, setOrganizations] = useState([]);
    const [loadingOrgs, setLoadingOrgs] = useState(false);
    const [errorOrgs, setErrorOrgs] = useState('');
    const [searchQuery, setSearchQuery] = useState(''); // Define searchQuery


    useEffect(() => {
        const loadOrganizations = async () => {
            try {
                if (!apiKey) {
                    setErrorOrgs('API key is missing.');
                    return;
                }
                setLoadingOrgs(true);
                const data = await fetchOrganizations(apiKey);
                setOrganizations(data);
            } catch (err) {
                setErrorOrgs(err.message);
            } finally {
                setLoadingOrgs(false);
            }
        };

        if (apiKeySubmitted) {
            loadOrganizations();
        }
    }, [apiKey, apiKeySubmitted]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await setApiKeyInBackend(apiKey);
            alert('API Key set successfully');
            setApiKeySubmitted(true);
        } catch (error) {
            alert('Failed to set API key: ' + error.message);
        }
    };

    const fetchEvents = async () => {
        try {
            if (selectedNetworks.length > 0) {
                const eventsData = await Promise.all(selectedNetworks.map(networkId => 
                    fetchNetworkEvents(networkId)));
                setEvents(eventsData.flat());
            }
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    useEffect(() => {
        if (apiKeySubmitted && selectedNetworks.length > 0) {
            fetchEvents();
        }
    }, [selectedNetworks, apiKeySubmitted]);

    const handleEventSelect = (eventData) => {
        setSelectedEvent(eventData);
    };

    const handleCloseCard = () => {
        setSelectedEvent(null);
    };

    const handleOrgClick = (orgId) => {
        setSelectedOrg(orgId);
    };

    return (
        <div>
            <Card>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="API Key"
                                    variant="outlined"
                                    value={apiKey}
                                    onChange={(e) => setApiKeyState(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                >
                                    Submit
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>

            {apiKeySubmitted && (
                <div>
                    <Card>
                        <CardContent>
                            <h2>Organizations</h2>
                            {loadingOrgs ? (
                                <p>Loading organizations...</p>
                            ) : errorOrgs ? (
                                <p>Error loading organizations: {errorOrgs}</p>
                            ) : (
                                <OrgList apiKey={apiKey} setSelectedOrg={setSelectedOrg} />
                            )}
                        </CardContent>
                    </Card>
                    {selectedOrg && (
                        <Card>
                            <CardContent>
                                <h2>Networks</h2>
                                <NetworkList
                                    orgId={selectedOrg}
                                    onNetworkSelectionChange={setSelectedNetworks}
                                />
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}

            {selectedNetworks.length > 0 && (
                <div>
                    <Card>
                        <CardContent>
                            <h2>Network Events</h2>
                            <TextField
                                fullWidth
                                label="Search events..."
                                variant="outlined"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <div style={{ height: 400, width: '100%' }}>
                            <DataGrid
    rows={events}
    getRowId={(row) => row.occurred_at} // Use a unique property as the ID
    columns={[
        { field: 'occurred_at', headerName: 'Occurred At', width: 180 },
        { field: 'network_id', headerName: 'Network ID', width: 150 },
        { field: 'type', headerName: 'Event Type', width: 150 },
        { field: 'description', headerName: 'Description', width: 250 },
        { field: 'category', headerName: 'Category', width: 150 },
        { field: 'client_id', headerName: 'Client ID', width: 150 },
        { field: 'client_description', headerName: 'Client Description', width: 200 },
        { field: 'client_mac', headerName: 'Client MAC', width: 200 },
        { field: 'device_serial', headerName: 'Device Serial', width: 200 },
        { field: 'device_name', headerName: 'Device Name', width: 200 },
        { field: 'ssid_number', headerName: 'SSID Number', width: 150 },
        {
            field: 'event_details',
            headerName: 'Event Details',
            width: 150,
            renderCell: (params) => (
                <button
                    onClick={() => handleEventSelect(params.row)}
                >
                    Expand
                </button>
            ),
        },
    ]}
    pageSize={10}
/>

                            </div>
                        </CardContent>
                    </Card>
                    {selectedEvent && (
                        <Card>
                            <CardContent>
                                {/* Your EventCard component */}
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
}

export default AppPage;