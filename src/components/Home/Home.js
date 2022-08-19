import React, { useEffect, useState } from 'react';
import { Container, Grow, Grid, Paper, AppBar, TextField, Button } from '@material-ui/core';
import Posts from '../Posts/Posts';
import Form from '../Form/Form';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { getPosts, getPostsBySearch } from '../../actions/posts';


import Pagination from '../Pagination';
import ChipInput from 'material-ui-chip-input';

import useStyles from './styles';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}


const Home = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const query = useQuery();
    const page = query.get('page') || 1;
    //const searchQuery = query.get('searchQuery');
    const [currentId, setCurrentId] = useState(null);
    const [search, setSearch] = useState("");
    const [tags, setTags] = useState([]);

    //const location = useLocation();
    /*useEffect(() => {
        if (!search && tags.length === 0) dispatch(getPosts(page));
    }, [search, tags]);*/
    /*
    useEffect(() => {
        dispatch(getPosts());
    }, [dispatch]);
    
    useEffect(() => {
        dispatch(getPosts());
    }, [dispatch,currentId]);*/
    useEffect(() => {
        localStorage.setItem('prevPage', page);
    }, [page])

    const handleKeyPress = (e) => {
        if (e.keyCode === 13) {
            searchPost();
        }
    }

    const searchPost = () => {
        if (search.trim() || tags) {
            dispatch(getPostsBySearch({ search, tags: tags.join(',') }));
            navigate(`/posts/search?searchQuery=${search || 'none'}&tags=${tags.join(',')}`);
        } else {
            navigate('/');
        }
    }

    let prevPage = Number(localStorage.getItem('prevPage'));

    const handleChange = (e) => {
        setSearch(e.target.value);
        if (e.target.value === "") dispatch(getPosts(prevPage));
    }

    const handleAddChip = (tag) => setTags([...tags, tag]);

    const handleDeleteChip = (chipToDelete) => {
        setTags(tags.filter((tag) => tag !== chipToDelete));
        console.log(tags)
        console.log(chipToDelete)
        if ((tags.length === 1) && (chipToDelete === tags[0])) {
            setTags([]);
            dispatch(getPosts(prevPage));
        }
    }

    return (
        <Grow in>
            <Container maxWidth="xl">
                <Grid container justifyContent="space-between" alignItems="stretch" spacing={3} className={classes.gridContainer}>
                    <Grid item xs={12} sm={6} md={9}>
                        <Posts setCurrentId={setCurrentId} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <AppBar className={classes.appBarSearch} position="static" color="inherit">
                            <TextField
                                name="search"
                                variant="outlined"
                                label="Search Memories"
                                fullWidth
                                value={search}
                                onChange={handleChange}
                                onKeyUp={handleKeyPress} />
                            <ChipInput
                                style={{ margin: '10px 0' }}
                                value={tags}
                                onAdd={(chip) => handleAddChip(chip)}
                                onDelete={(chip) => handleDeleteChip(chip)}
                                label="Search Tags"
                                variant="outlined"
                            />
                            <Button onClick={searchPost}
                                className={classes.searchButton}
                                variant="contained"
                                color="primary" disabled={!search && tags.length === 0}>Search</Button>
                        </AppBar>
                        <Form currentId={currentId} setCurrentId={setCurrentId} />
                        <Paper elevation={6}>
                            <Pagination page={page} />
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Grow>
    )
}

export default Home;