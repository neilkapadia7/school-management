import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { deleteNotes } from '../../../Actions/adminActions';

const NotesItem = ({ notes, deleteNotes }) => {
	const Delete = () => {
		deleteNotes(notes._id);
	};

	return (
		<div className='student-item'>
			<h3 className='notes-title'>{notes.title}</h3>
			<a
				href={notes.path}
				download={notes.title}
				className='fileupload-download'>
				Download
			</a>
			<br />
			<Moment format='MMMM d, YYYY' className='notes-date'>
				{notes.date}
			</Moment>
			<br />
			<a onClick={Delete} className='notes-delete'>
				Delete
			</a>
		</div>
	);
};

NotesItem.propTypes = {
	deleteNotes: PropTypes.func.isRequired,
};

export default connect(null, { deleteNotes })(NotesItem);
