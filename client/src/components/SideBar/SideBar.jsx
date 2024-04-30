import { useCallback, useContext, useState } from "react";
import { FriendContext } from "../../Home";
import { CiChat1 } from "react-icons/ci";
import { FaCircle } from "react-icons/fa";
import AddFriendModal from "../../Modals/AddFriendModal"
import "./style.css";

function SideBar() {
    const [isOpen, setIsOpen] = useState(false);
    const { friendList } = useContext(FriendContext);
    const onOpen = useCallback(() => {
        setIsOpen(true);
    }, []);
    const onClose = useCallback(() => {
        setIsOpen(false);
    }, []);

    return (
        <>
            <aside className="sidebar-container">
                <div className="sidebar-add-friend">
                    <h3>Add Friend</h3>
                    <button onClick={onOpen}>
                        <CiChat1 size={20} color="black" />
                    </button>
                </div>
                {/* <Divider /> */}
                {friendList.length > 0 ? (
                    <div>
                        {friendList.map((friend) => (
                            <div as={Tab} justify={"start"} w="100%">
                                <FaCircle
                                    color={friend.connected ? "green" : "red"}
                                    size={20}
                                />
                                <p>{friend.username}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No friends click Add Friend to Start conversation</p>
                )}
            </aside>
            {isOpen && <AddFriendModal onClose={onClose} />}
        </>
    );
}

export default SideBar;