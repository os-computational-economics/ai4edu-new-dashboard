import { Modal, ModalHeader, ModalBody, ModalFooter, ModalContent, Button, Input } from '@nextui-org/react'
import { useContext, useState } from 'react'
import { deleteAgent } from '@/api/agent/agent'
import { WorkspaceContext } from '@/components/layout/layout'
import { studentJoinWorkspace } from '@/api/workspace/workspace'
import { MdInfoOutline } from 'react-icons/md'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Cookies from 'js-cookie'
import { ping } from '@/api/auth/auth'

const AgentJoinModal = ({ isOpen, onClose }) => {
  const { currentWorkspace, setCurrentWorkspace } = useContext(WorkspaceContext)
  const [workspaceID, setWorkspaceID] = useState('')
  const [workspacePassword, setWorkspacePassword] = useState('')

  const handleCloseModal = () => {
    setWorkspaceID('')
    setWorkspacePassword('')
    onClose()
  }

  const onSubmit = () => {
    const param = { workspace_id: workspaceID, password: workspacePassword }
    studentJoinWorkspace(param)
      .then((response) => {
        toast.success('Join successful, please logout and login again to see the changes')
        handleCloseModal()
        Cookies.remove('access_token')
        ping()
          .then((res) => {
            // if the refresh token is valid, set the new access token
            window.location.reload()
          })
          .catch((err) => {
            window.location.href = '/auth/signin'
          })
        console.log('response', response)
      })
      .catch((error) => {
        console.error('Error joining workspace:', error)
      })
  }

  return (
    <div>
      <ToastContainer />
      <Modal isOpen={isOpen} onClose={() => handleCloseModal()}>
        <ModalContent>
          <ModalHeader>Join Workspace</ModalHeader>
          <ModalBody>
            <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg">
              <MdInfoOutline size={24} />
              <span className="text-black-100 text-xs">
                To join new workspace, enter <span className="font-semibold">Workspace ID</span> and
                <span className="font-semibold"> Workspace Password</span> provided from your instructor.
              </span>
            </div>

            <Input
              size="sm"
              variant="bordered"
              label="Workspace ID"
              isRequired
              value={workspaceID}
              onValueChange={(value) => setWorkspaceID(value)}
              isClearable
            />
            <Input
              size="sm"
              variant="bordered"
              label="Workspace Password"
              isRequired
              value={workspacePassword}
              onValueChange={(value) => setWorkspacePassword(value)}
              isClearable
            />
          </ModalBody>

          <ModalFooter>
            <Button variant="faded" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button color="primary" onClick={onSubmit} isDisabled={!workspaceID || !workspacePassword}>
              Join
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default AgentJoinModal
