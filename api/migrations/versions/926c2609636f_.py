"""empty message

Revision ID: 926c2609636f
Revises: 92cdd9061ece
Create Date: 2020-11-01 11:24:07.716247

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '926c2609636f'
down_revision = '92cdd9061ece'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('rooms',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=50), nullable=False),
    sa.Column('group_image', sa.String(length=255), nullable=True),
    sa.Column('no_users', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('contacts',
    sa.Column('user', sa.Integer(), nullable=True),
    sa.Column('friend', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['friend'], ['users.id'], ),
    sa.ForeignKeyConstraint(['user'], ['users.id'], )
    )
    op.create_table('groups',
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('room_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['room_id'], ['rooms.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], )
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('groups')
    op.drop_table('contacts')
    op.drop_table('rooms')
    # ### end Alembic commands ###
