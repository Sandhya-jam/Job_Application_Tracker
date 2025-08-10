import { useCreateMutation } from '../../Redux/api/jobsApiSlice'
import { useState } from 'react'
import { motion,AnimatePresence} from 'framer-motion'
import { useSelector} from 'react-redux'

const CreateForm = () => {
    const [createJob,{isLoading,error}]=useCreateMutation()
    const {userInfoJ}=useSelector(state=>state.auth)
    const [formData,setFormData]=useState({
        title:'',
        role:'FTE',
        company:'',
        location:'',
        jobUrl:'',
        status:'Wishlist',
        notes:'',
        contacts:[],
        user:userInfoJ._id
    });
    
    const handleChange=(e)=>{
       const {name,value}=e.target
       setFormData(prev=>({...prev,[name]:value}))
    }
    
    const handleContactChange = (index, e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updatedContacts = [...prev.contacts];
      updatedContacts[index] = { ...updatedContacts[index], [name]: value };
      return { ...prev, contacts: updatedContacts };
    });
  };
    
    const addContact = () => {
    setFormData(prev => ({
      ...prev,
      contacts: [...prev.contacts, { name: '', email: '', phone: '', position: '', notes: '' }],
    }));
  };
   
  const removeContact = index => {
    setFormData(prev => ({
      ...prev,
      contacts: prev.contacts.filter((_, i) => i !== index),
    }));
  };
   
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await createJob(formData).unwrap();
      console.log('Created Job:', res);
      setFormData({
        title: '',
        role: 'FTE',
        company: '',
        location: '',
        jobUrl: '',
        status: 'Wishlist',
        notes: '',
        contacts: [],
        user: formData.user,
      });
    } catch (err) {
      console.error('Error creating job:', err);
    }
  };


  return (
    <motion.form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg space-y-4 max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-700 scrollbar-track-purple-200 hover:scrollbar-thumb-purple-800"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <h2 className="text-2xl font-bold text-gray-800 text-center">
        Create New Job
      </h2>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-black mb-1">
          Job Title
        </label>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Backend Developer"
          className="w-full border border-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-800"
          required
        />
      </div>

      {/* Company */}
      <div>
        <label className="block text-sm font-medium text-black mb-1">
          Company
        </label>
        <input
          name="company"
          value={formData.company}
          onChange={handleChange}
          placeholder="e.g., OpenAI"
          className="w-full border border-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-800"
          required
        />
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-black mb-1">
          Location
        </label>
        <input
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="e.g., Remote"
          className="w-full border border-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-800"
          required
        />
      </div>

      {/* Job URL */}
      <div>
        <label className="block text-sm font-medium text-black mb-1">
          Job URL
        </label>
        <input
          name="jobUrl"
          value={formData.jobUrl}
          onChange={handleChange}
          placeholder="https://company.com/careers"
          className="w-full border border-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-800"
        />
      </div>

      {/* Role */}
      <div>
        <label className="block text-sm font-medium text-black mb-1">
          Role
        </label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full border border-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-800"
        >
          <option value="FTE" className='bg-gray-300'>FTE</option>
          <option value="Intern" className='bg-gray-300'>Intern</option>
        </select>
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-black mb-1">
          Status
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full border border-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-800"
        >
          <option value="Wishlist" className='bg-gray-300'>Wishlist</option>
          <option value="Applied" className='bg-gray-300'>Applied</option>
          <option value="Interviewing" className='bg-gray-300'>Interviewing</option>
          <option value="Offered" className='bg-gray-300'>Offered</option>
          <option value="Rejected" className='bg-gray-300'>Rejected</option>
          <option value="Accepted" className='bg-gray-300'>Accepted</option>
          <option value="Declined" className='bg-gray-300'>Declined</option>
          <option value="Archieved" className='bg-gray-300'>Archieved</option>
        </select>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-black mb-1">
          Notes
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Additional details about this job..."
          rows="3"
          className="w-full border border-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-800"
        />
      </div>
       
       <div>
        <h3 className="text-lg font-semibold text-gray-800">Contacts</h3>
        <AnimatePresence>
          {formData.contacts.map((contact, index) => (
            <motion.div
              key={index}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-2 mt-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {['name', 'email', 'phone', 'position', 'notes'].map(field => (
                <div key={field}>
                  <label className="block text-xs font-medium text-gray-600 mb-1 capitalize">{field}</label>
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    name={field}
                    value={contact[field]}
                    onChange={e => handleContactChange(index, e)}
                    placeholder={`Enter ${field}`}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => removeContact(index)}
                className="text-red-500 text-sm hover:underline"
              >
                Remove Contact
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        <button
          type="button"
          onClick={addContact}
          className="mt-2 px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
        >
          + Add Contact
        </button>
      </div>

      {/* Submit */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        type="submit"
        disabled={isLoading}
        className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
      >
        {isLoading ? 'Creating...' : 'Create Job'}
      </motion.button>

      {/* Error */}
      {error && (
        <motion.p
          className="text-red-500 text-sm text-center mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error?.data?.message || 'Something went wrong'}
        </motion.p>
      )}
    </motion.form>
  )
}

export default CreateForm